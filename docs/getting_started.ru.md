
Начало работы
===========

Чтобы просматривать и редактировать файлы с помощью MMDS на локальном компьютере, нужно запустить локальный 
сервер в директории с основным файлом MMDS (по умолчанию — `index.html`), например так, если у вас установлен
Python 3:

```
$ python3 -m http.server
```

Или, если есть node.js (первая строчка устанавливает модуль, это надо сделать один раз):

```
$ npm install http-server -g 
$ http-server
```

Первый запуск
--------------
1. Скачайте последний релиз
1. Распакуйте архив
1. Все, что вам нужно, находится в папке `dist`

Запустите локальный сервер в папке `dist`, перейдите по его адресу. По умолчанию файлы располагаются в директории `md`. Попробуйте добавить туда
свои файлы и отредактировать файл `sidebar.md`, в нем находится меню.

### Редактирование
Чтобы начать редактировать файл, нажмите кнопку `edit` внизу страницы. Откроется редактор. Особенно удобно им пользоваться в режиме разбиения экрана, тогда вы будете одновременно видеть редактируемый текст и результат рендеринга.

Нажав кнопку `view` можно переключится обратно в режим просмотра. Если в файле остались несохраненные правки, вы увидите предупреждение.

Кнопка сохранения находится на панели инструментов редактора, на ней изображен ~~квадратик с отсеченным углом, глазками и раскрытым ртом~~ флоппи-диск.

По крайней мере, пока что после сохранения может понадобится перезагрузить страницу, чтобы увидеть изменения.

Теперь можно переходить к [созданию первого сайта](basic_setup.ru.md)




