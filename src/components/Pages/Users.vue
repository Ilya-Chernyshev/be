<template lang="pug">
	.users
		transition(v-if="statusShow" name="fade")
			.users-container
				.row
					b-navbar.users-container-fluid(variant="light" )
						h3 Пользователи
				b-table.table-cust(:items="users" :fields="fields" responsive)

					template(v-slot:cell(last_name)="data")
						Validation-observer(ref="observer" v-slot="{ invalid }")
							validation-provider(
								:name="'Age' + data.index"
								:rules="{ required: true, min: 1, max: 255, regex: /^([А-яA-z0-9]{1,})$/g}"

								v-slot="validationContext")
									b-form-input.blue-once(
										:name="'last_name' + data.index"
										v-model="setModel(inputsLastName, data.value.last_name, data.value.id).value"
										@blur="checkValueInput(inputsLastName, $event, data.value.phone, data.value.id, 'last_name', 'value')"
										type="text"
										:state="getValidationStateText(inputsLastName, data.value.id)")

					template(v-slot:cell(first_name)="data")
						Validation-observer(ref="observer" v-slot="{ invalid }")
							validation-provider(
								:name="'Age' + data.index"
								:rules="{ required: true, min: 1, max: 255, regex: /^([А-яA-z0-9]{1,})$/g}"

								v-slot="validationContext")
									b-form-input.blue-once(
										:name="'first_name' + data.index"
										v-model="setModel(inputsName, data.value.first_name, data.value.id).value"
										@blur="checkValueInput(inputsName, $event, data.value.phone, data.value.id, 'first_name', 'value')"
										type="text"
										:state="getValidationStateText(inputsName, data.value.id)")


					template(v-slot:cell(age)="data")
						Validation-observer(ref="observer" v-slot="{ invalid }")
							validation-provider(
								:name="'Age' + data.index"
								:rules="{ required: true, regex: /[0-9]/}"

								v-slot="validationContext")
								b-form-input.blue-once.small-input(
									v-mask="'###'"
									:name="'Age' + data.index"
									v-model="setModel(inputsAge, data.value.age, data.value.id).value"
									@blur="checkValueInput(inputsAge, $event, data.value.phone, data.value.id, 'age', 'value')"
									
									type="text"
									:state="getValidationStateAge(validationContext, setModel(inputsAge, data.value.age, data.value.id).value)")

					//- Phone Data 
					template(v-slot:cell(phone)="data")
						Validation-observer(ref="observer" v-slot="{ invalid }")
							validation-provider(
								:name="'Phone' + data.index"
								:rules="{required: true, regex: /^\.7\.9[0-9]{2}\. [0-9]{3}\.[0-9]{2}\.[0-9]{2}/}"
								v-slot="validationContext")
								
								b-form-input.blue-once.form-control(
									:value="data.value.phone"
									type="tel"
									v-mask="'+7(###) ###-##-##'"
									v-model="setModel(inputsPhone, data.value.phone, data.value.id).value"
									@blur="checkValueInput(inputsPhone, $event, data.value.phone, data.value.id, 'phone', 'value')"
									:name="'Phone' + data.index"
									:state="getValidationState(validationContext)")
	
					template(v-slot:cell(sex)="data")
						b-form-select.select-base(v-model="setModelSelect(selectsSex, data.value.sex, data.value.id).selected"
						@change="checkValueSelect(selectsSex, $event, data.value.sex, data.value.id, 'sex', 'selected')"
						:options="selectSexValue")
						
						//- .sex.data-cell {{setSex(data.value.sex)}}

					template(v-slot:cell(is_approved)="data")
						.data-cell {{isApproved(data.value.is_approved)}}

					template(v-slot:cell(visit_number)="data")
						.data-cell {{data.value.visit_number}}

					template(v-slot:cell(company_id)="data")
						.data-cell {{data.value.company_id}}

					template(v-slot:cell(avatar)="data")
						.data-cell {{checkAvatar(data.value.avatar)}}

					template(v-slot:cell(created_at)="data")
						.data-cell {{createdDate(data.value.created_at)}}

					template(v-slot:cell(index)="data")
						.data-cell {{ data.index + 1}}
				//- Pagination
				b-pagination(:per-page="perPage" v-model="currentPage" :total-rows="rows"  limit="5" @change="pagination" align="center")
</template>
<script>
	export default {
		data() {
			return {
				currentPage: 1,
				poperCheckboxHeader: { customClass: 'poper-cust-dark' },
				statusShow: false,
				val: '',
				inputsPhone: [],
				inputsAge: [],
				inputsName: [],
				inputsLastName: [],
				selectsSex: [],
				count: 0,
				selectSexValue: [
					{ value: null, text : 'Не задан'},
					{ value: 'male', text : 'Муж'},
					{ value: 'female', text : 'Жен'}
				],
				selectSexValueNotNull: [
					{ value: 'male', text : 'Муж'},
					{ value: 'female', text : 'Жен'}
				]
			}
		},
		mounted(){
			this.$store.dispatch('SHOW_LOADING');
			this.$store.dispatch('ALL_USERS')
			.then(() => {
				this.$store.dispatch('HIDE_LOADING');
					this.statusShow = true;
				})
			.catch((resp) => {
				this.catchErr(resp);
			})
			console.log( this.currentPageStore)
			this.currentPage = this.currentPageStore;
		},
		methods: {
			catchErr(data) {
				if (data.response) {					
					switch (data.response.status) {
						case 403:
							this.setPopup('Доступ закрыт.', 'Вам не доступен раздел список пользователей. Обратитесь к администратору для получения дополнительной информации.');
						break;
						default:
							this.setPopup();
						break;
					}
				}
				else {
					this.setPopup();
				}

				this.statusShow = false;
				this.$store.dispatch('HIDE_LOADING');
			},
			pagination(page) {
				if (this.currentPageStore != page) {
					this.$store.dispatch('SHOW_LOADING');
					this.$store.commit('CURRENT_PAGE_USERS', page);
					this.$store.dispatch('ALL_USERS')
					.then(() => {
						this.$store.dispatch('HIDE_LOADING');
						this.statusShow = true;
					})
					.catch((resp) => {
						this.catchErr(resp);
					})
				}
			},
			setPopup(title, desc, delay, type) {
				title = (title === undefined) ? 'Что-то пошло не так.' : title
				desc  = (desc  === undefined) ? 'Попробуйте позже' : desc
				delay = (delay === undefined) ? 10000 : delay;
				type  = (type  === undefined) ? 'danger' : type;

				this.$bvToast.toast(desc, {
					title: title,
					variant: type,
					solid: true,
					autoHideDelay: delay
				});
			},
			setSex(value) {
				switch (value) {
					case 'male':
						return 'Муж';
					case 'female':
						return 'Жен';
					default:
						return 'Не задан';
				}
			},
			isApproved(value) {
				if (value) {
					return 'Да';
				}
				return 'Нет';
			},
			checkAvatar(value) {
				if (value) {
					return value;
				}
				return 'Не задана';
			},
			createdDate(value) {
				let checkZero = function(value) {
					value = +value;
					if (value <= 9) {
						value = `0${value}`;
					}
					return value;
				};

				if (value) {
					let date = new Date(value);

					if (date) {
						let year  = date.getFullYear()
						,   day   = date.getDate()
						,   month = date.getMonth() + 1;

						return `${checkZero(day)}.${checkZero(month)}.${year}`;
					}
				}
				return 'Не задана';
			},
			setEmptySroreDataInput(state, storeData, id, prop, type) {
				for (let i = 0; i < state.length; i++) {
					if (state[i].id === id) {
						if (storeData) {
							state[i][type] = storeData;
						}
					}
				}
			},
			getSroreDataInput(id, prop) {
				for (let i = 0; i < this.usersState.length; i++) {
					if(this.usersState[i].id === id){
						return this.usersState[i][prop];
					}
				}
			},
			createRequestObj(id, prop, inputValue) {
				return  {
					id : id,
					[prop] : inputValue
				}
			},
			checkValue(state, value, afterValue, id, prop) {
				return new Promise((resolve, reject) => {

					var storeData  = this.getSroreDataInput(id, prop)
					,   inputValue = (prop === 'phone') ? `+${value.toString().replace(/[^0-9]/gi, '')}` : value;

					if (inputValue === '') {
						reject({storeData});
					}
					else {
						resolve({storeData, inputValue});
					}
				})
			},
			checkValueInput(state, event, afterValue, id, prop, type) {
					event.target.value = this.checkZeroStartStr(state, id);

				this.checkValue(state, event.target.value, afterValue, id, prop, type)
				.then(({storeData, inputValue}) => {
					if (this.checkValidSelector(event.target) && this.condition(inputValue, storeData)) {
						this.$store.dispatch('UPDATE_USERS', [this.createRequestObj(id, prop, inputValue)])
						.then(() => {
							this.setPopup('Изменения успешно сохранены', `${storeData} => ${inputValue}`, undefined, 'success')
						})
						.catch(this.catchSendData)
					}
				})
				.catch(({storeData}) => {
					this.setEmptySroreDataInput(state, storeData, id, prop, type);
				});
			},

			checkValueSelect(state, event, afterValue, id, prop, type) {
				this.checkValue(state, event, afterValue, id, prop, type)
				.then(({storeData, inputValue}) => {
					if (this.condition(inputValue, storeData)) {
						this.$store.dispatch('UPDATE_USERS', [this.createRequestObj(id, prop, inputValue)])
						.then(() => {
							this.setPopup('Изменения успешно сохранены', `${this.setSex(storeData)} => ${this.setSex(inputValue)}`, undefined, 'success')
						})
						.catch(this.catchSendData)
					}
				})
				.catch(({storeData}) => {
					this.setEmptySroreDataInput(state, storeData, id, prop, type);
				});
			},
			catchSendData(response) {
				if (response) {							
					switch (response.response.status) {
						case 422:
							this.setPopup('Ошибка сохранения', 'Введенные данные содержат ошибки.');
						break;
						default:
							this.setPopup();
						break;
					}
				}
				else {
					this.setPopup();
				}
			},
			checkValidSelector(el) {
				return el.classList.contains('is-valid');
			},
			condition(valBefore, valAfter){
				valBefore = valBefore.toString();
				valAfter  = valAfter.toString();

				if (valAfter !== valBefore) {
					return true;
				}
				return false;
			},
			setModel(state, value, id) {
				let obj = {id: id, value: value};

				for (var i = 0; i < state.length; i++) {
					if (state[i].id === id) {
						return state[i];
					}
				}

				state.push(obj);

				return state[state.length - 1];
			},

			setModelSelect(state, value, id) {
				let obj = {id: id, selected: value};

				for (var i = 0; i < state.length; i++) {
					if (state[i].id === id) {
						return state[i];
					}
				}

				state.push(obj);

				return state[state.length - 1];
			},
			getValidationState({ dirty, validated, valid = null }) {
				return dirty || validated ? valid : null;
			},
			getValidationStateAge({ dirty, validated, valid = null }, value) {
				if (value > 100 || value <= 0) {
					return false
				}
				else {
					
					return dirty || validated ? valid : null;
				}
			},
			getValidationStateText(data, id) {
				for (let i = 0; i < data.length; i++) {
					if (data[i].id === id) {
						var regText = /[ \t\v\r\n\f]/;
						var condition = 
						!regText.test(data[i].value)
						&& data[i].value.length <=255 
						&& data[i].value.length > 0;

						if (condition) {
							return true
						}
						else {
							return false
						}
					}
					
				}
				return false;
			},
			checkZeroStartStr(data, id) {
				for (var i = 0; i < data.length; i++) {
					if (id == data[i].id) {
						const PATTERN_NUMBER = /^[0]{1,}/gi;

						if (PATTERN_NUMBER.test(data[i].value)) {
							data[i].value = data[i].value.replace(PATTERN_NUMBER, '');
						}
							return data[i].value;
					}
				}
			}
		},
		computed : {
			perPage() {
				return this.$store.state.users.perPage
			},
			users() {
				return this.$store.getters.getUsersAddID
			},
			usersState() {
				return this.$store.state.users.users
			},
			rows() {
				return this.$store.state.users.totalUsers
			},
			currentPageStore() {
				return this.$store.state.users.currentPage
			},
			fields() {
				return this.$store.state.users.fields
			}
		}
	}
</script>

<style src='@/sass/components/users.sass' lang="sass"></style>
