'use strict';
(function () {

    var template = document.querySelector('#template__foto_link');
    var portfolio__link_wrap;

    if ('content' in template)
    {
        portfolio__link_wrap = template.content.children[0].cloneNode(true);
    } else
    {
        portfolio__link_wrap = template.children[0].cloneNode(true);
    }

    var index_section_portfolio__foto = document.querySelectorAll('.index_section_portfolio__foto');

    var tmp;
    Array.prototype.forEach.call(index_section_portfolio__foto, function (item) {
        tmp = portfolio__link_wrap.cloneNode(true);
        item.appendChild(tmp);
    });

    //MOBILE MENU
    var menu_mobile_icon, menu, menu_heigth, main_center;
    //var viewport_width = document.documentElement.clientWidth;
    //var viewport_heigth = document.documentElement.clientHeight;
    menu_mobile_icon = document.querySelector('.menu_mobile_icon');
    menu = document.querySelector('.index_section_nav__menu_wrap');
    menu_heigth = getComputedStyle(menu).getPropertyValue("height");
    menu.style.top = '-' + menu_heigth;
    main_center = document.querySelector('.index_section_header');

    window.addEventListener('resize', function () {
        menu_heigth = getComputedStyle(menu).getPropertyValue("height");
        menu.style.top = '-' + menu_heigth;
        menu_mobile_icon.classList.remove('opened');
        main_center.style.marginTop = '';
    })

    menu_mobile_icon.addEventListener('click', function () {
        if (!menu_mobile_icon.classList.contains('opened'))
        {
            menu_mobile_icon.classList.add('opened');
            menu.style.top = 0;
            main_center.style.marginTop = menu_heigth;
        } else
        {
            menu_mobile_icon.classList.remove('opened');
            menu.style.top = '-' + menu_heigth;
            main_center.style.marginTop = '';
        }
    });

})();