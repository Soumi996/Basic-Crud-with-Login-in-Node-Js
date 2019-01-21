$(document).ready(function(){
    $('.delete-article').on('click', function(){    
        const id = $('.delete-article').attr('data-id');
        // alert(id);
        $.ajax({
            type: 'DELETE',
            url: '/article/'+id,
            success: function(response){
                alert('Deleteing the Article');
                window.location.href = '/'
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});