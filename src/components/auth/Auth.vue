<template lang="pug">
	.container
		.auth-template
			.auth-template-content
				h2._mb-16 Авторизация
				Validation-observer(ref="observer" v-slot="{ invalid }")
					b-form(@submit.stop.prevent="onSubmit" v-if="show")
						validation-provider(
							name="Phone"
							:rules="{ required: true, regex: /^\.7\.9[0-9]{2}\. [0-9]{3}\.[0-9]{2}\.[0-9]{2}/}"
							v-slot="validationContext")
							.input-group-prepend._mb-32
								span.input-group-text
									img(src="@/assets/icons/auth-template/user-alt.svg", alt="")
								b-form-input.form-control(
									placeholder="+7(999) 999-99-99"
									name="Phone" 
									v-model="form.phone" 
									type="tel"
									v-mask="'+7(###) ###-##-##'"
									@input="resetServerError"
									:disabled="submitStatus"
									:state="getValidationState(validationContext) && !invalidInput")
								b-form-invalid-feedback.error-text-vee(v-if="!invalidInput") Введите корректный номер телефона
						validation-provider(
							name="Password"
							:rules="{ required: true, min: 6 }"
							v-slot="validationContext")
							.input-group-prepend._mb-32
								span.input-group-text
									img(src="@/assets/icons/auth-template/key.svg", alt="")
								b-form-input.form-control(
									placeholder="Пароль"
									@input="resetServerError"
									v-model="form.password"
									type="password"
									:disabled="submitStatus"
									:state="getValidationState(validationContext) && !invalidInput")
								b-form-invalid-feedback.error-text-vee(v-if="!invalidInput") Минимальная длина пароля 6 симвл.
						transition(name="slide-toggle")
							.invalid-feedback.cust-invalid-feedback(v-if="invalidInput") {{textServerError}}
						b-button.btn-load-spiner(type="submit" variant="primary" :disabled="invalid || invalidInput")
							b-spinner.button-spiner(small :class="{'active-load': submitStatus}")
							span.button-text-spiner(:class="{'active-load': !submitStatus}") Войти

</template>
<script>
export default {
	name: 'Auth',
	data() {
		return {
			show: true,
			invalidInput: false,
			textServerError: '',
			submitStatus: false,
			form: {
				phone : null,
				password: null
			}
		}
	},
	methods: {
		onSubmit() {
			this.submitStatus = true;
			this.authRequest();
		},
		getValidationState({ dirty, validated, valid = null }) {
			return dirty || validated ? valid : null;
		},
		resetServerError() {
			this.invalidInput = false;
			this.textServerError = '';
		},
		setDataCatch(thrown) {
			if (thrown.response.data && thrown.response.data.message) {
				this.invalidInput = true;
				this.textServerError = thrown.response.data.message;
				this.submitStatus = false;
			}
		},
		setErrorPopup(title, desc, delay) {
			title = (title === undefined) ? 'Что-то пошло не так.' : title
			desc  = (desc  === undefined) ? 'Попробуйте позже' : desc
			delay = (delay === undefined) ? 10000 : delay;

			this.$bvToast.toast(desc, {
				title: title,
				variant: 'danger',
				solid: true,
				autoHideDelay: delay
			});

			this.submitStatus = false;
		},
		checkCatch(thrown) {
			if (thrown.response) {				
				switch (thrown.response.status) {
					case 422:
						this.setDataCatch(thrown);
					break;
					case 401:
						this.setDataCatch(thrown);
					break;
					default:
						this.setErrorPopup();
					break;
				}
			}
			else {
				if (thrown.request && thrown.request.status === 0 && thrown.message === 'Network Error') {
					this.setErrorPopup('Ошибка соединения с сервером', 'Попробуйте позже.', 15000);
				}
				else {
					this.setErrorPopup();
				}
				
			}

		},
		getRequestPhoneData() {
			return '+' + this.form.phone.replace(/[^0-9]/g,'');
		},
		createFormData() {
			let form      = new FormData()
			,   dataPhone = this.getRequestPhoneData();

			form.append('phone', dataPhone);
			form.append('password', this.form.password);

			return form;
		},
		authRequest() {
			this.$store.dispatch('AUTH_REQUEST', this.createFormData()).then(() => {
				this.$router.push('/');
			})
			.catch((thrown) => {
				this.checkCatch(thrown);
			});
		}
	}
}
</script>

<style src='@/sass/components/auth.sass' lang="sass"></style>