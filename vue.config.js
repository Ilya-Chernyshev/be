module.exports = {
	css: {
		requireModuleExtension: false,
		loaderOptions: {
			sass: {
				prependData: `@import "src/sass/var/variables.sass"`
			}
		}
	}
}