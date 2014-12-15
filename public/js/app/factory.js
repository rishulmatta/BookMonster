easy.factory ('authenticate', function (){
	return {
		currentUser:{
			
		},
		isAuthenticated : function () {
			return !!this.currentUser;
		}

	}
});