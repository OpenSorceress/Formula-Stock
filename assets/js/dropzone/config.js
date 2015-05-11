(function($) {
	$(document).ready(function() {
		Dropzone.autoDiscover = false;
		
		$("#uploads").dropzone({
			url: "/file/post",
			uploadMultiple: true,
			maxFiles: 10,
			parallelUploads: 10,
			acceptedFiles: ".json",
			success: function(file, response) {
				alert(response);
			},
			error: function(response) {
				alert(response);
			}
		});
	});
})(jQuery);