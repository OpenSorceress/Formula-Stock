(function($) {
/*
	Dropzone.options.myAwesomeDropzone = {
  paramName: "file", // The name that will be used to transfer the file
  maxFilesize: 2, // MB
  accept: function(file, done) {
    if (file.name == "justinbieber.jpg") {
      done("Naha, you don't.");
    }
    else { done(); }
  }
};
*/
	$(document).ready(function() {
		$("#uploads").dropzone({
			url: "/file/post",
			uploadMultiple: true,
			maxFiles: 10,
			parallelUploads: 10
		});
	});
})(jQuery);