My Markdown Site
================

MMDS это CMS/просмотровщик/редактор markdown, работающий полностью на 
стороне клиента. С его помощью можно быстро опубликовать набор файлов
в виде сайта. 


Возможности
-----------
* Никаких ограничений на форматирование ваших файлов
* Собственный URL  у каждого файла
* Меню
* Произвольный дизайн (минимум обязательных элементов)
* Редактирование и сохранение файлов
* Максимально быстрый и легкий (редактор загружается только при необходимости, основной скрипт менее 200 КБ)

Предварительные условия
-----------------------
Чтобы просматривать и редактировать файлы с помощью MMDS на локальном компьютере, нужно запустить локальный 
сервер в директории с основным файлом MMDS, например так, если у вас установлен
Python 3:

```
python3 -m http.server
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

