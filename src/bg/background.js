;(function(){
    "use strict";

    WeShareOp.init();

})();

function redirect(_url,_args){
    _args = _args||{};
    var _method = (typeof _args.method!='undefined'?_args.method:'post');
    var _data = (typeof _args.data!='undefined'?_args.data:{});
    var _target = (typeof _args.target!='undefined'?_args.target:'_self');
    var _shadowForm = document.createElement('form');
    _shadowForm.setAttribute('action',_url);
    _shadowForm.setAttribute('method',_method);
    _shadowForm.setAttribute('target',_target);

    var _regex = new RegExp('\\[\\]$');
    for( var _k in _data ){
        if( _regex.test(_k) === true ){
            for( var _i=0, _l=_data[_k].length ; _i<_l ; _i++ ){
                var _input = document.createElement('input');
                _input.setAttribute('name',_k);
                _input.setAttribute('value',_data[_k][_i]);
                _input.setAttribute('type','hidden');
                _shadowForm.appendChild(_input);
            }
        }else{
            var _input = document.createElement('input');
            _input.setAttribute('name',_k);
            _input.setAttribute('value',_data[_k]);
            _input.setAttribute('type','hidden');
            _shadowForm.appendChild(_input);
        }
    }
    /*_shadowForm.appendTo('body').submit().remove();*/
    document.body.appendChild(_shadowForm);
    _shadowForm.submit();
    _shadowForm.parentNode.removeChild(_shadowForm);
}