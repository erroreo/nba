var apiURL = 'http://localhost:3000/'
var app = new Vue({
    el:'#app',
    data:{
        pagedata : []
    },
    created:function(){
        this.fetchData();
    },
    methods:{
        fetchData:function(){
            var xhr = new XMLHttpRequest()
            var self = this
            xhr.open('GET',apiURL)
            xhr.onload = function (){
                self.pagedata = JSON.parse(xhr.responseText)
            } 
            xhr.send()
        },
    }
})