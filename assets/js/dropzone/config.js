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
				if(response.error) {
					var node, _i, _len, _ref, _results;
					var message = response.msg;
					file.previewElement.classList.add("dz-error");
					_ref = file.previewElement.querySelectorAll("[data-dz-errormessage]");
					_results = [];
					for (_i = 0, _len = _ref.length; _i < _len; _i++) {
						node = _ref[_i];
						_results.push(node.textContent = message);
					}
					
					return _results;
				} else {
					return file.previewElement.classList.add("dz-success");
				}
			}
		});
	});
})(jQuery);