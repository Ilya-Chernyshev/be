<template lang="pug">
	.div
		b-jumbotron(header="Добро пожаловать в панель администратора", lead="С помощью данного ресурса, Вы можете управлять состоянием данных в приложении 'Будь'." header-level="3")
		.row
			.col-lg-3
				b-card.card-main(bg-variant="light" title="Пользователи")
					b-card-text Упровление пользователями
					b-link.btn.btn-primary(to="/users" router-tag="button") Перейти
			.col-lg-3
				b-card.card-main(bg-variant="light" title="Новости")
					b-card-text Скоро вам будет тоступно управление новостями
					b-link.btn.btn-primary(to="/users" router-tag="button" disabled) Перейти

</template>
<script>
	export default {}
</script>