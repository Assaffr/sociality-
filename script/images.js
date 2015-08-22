	$(document).ready(function(){					
					verifyLogin();
					$("#profilePhotoForm").on("submit", uploadProfileImage);
					$("#coverPhotoForm").on("submit", uploadCoverImage);
					
	});