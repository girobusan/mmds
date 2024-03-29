# Java Script API

Функции, доступные для пользовательских скриптов, находятся в объекте `window.MMDS`.

```
console.log("MMDS version: " + window.MMDS.version")
```

## См. также
* [Content объект](api_content.ru.md)

## Описание полей

| Поле | Тип |  Описание |
|---|---|---|
| `version` |  строка | Версия основного скрипта |
| `editMode`  | Булево значение  | Находимся ли мы в режиме редактирования |
| `current` | Объект [content](api_content.ru.md) | Содержимое текущего документа |
| `settings` | Объект | Текущие  настройки |
| `page404` | Функция | Функция, получающая в виде аргумента путь, а выдающая [content](api_content.ru.md) страницы с сообщением об отсутствии документа |
| `makePath` | Функция | Функция, принимающая путь к документу относительно директории с файлами markdown, и возвращающая путь к нему относительно основного html файла |
| `addUpdater` | Функция | Функция добавляет переданную в качестве аргумента функцию в очередь выполнения при обновлении страницы, возвращает идентификатор |
| `removeUpdater` | Функция | Принимает в качестве аргумента идентификатор функции-updater`а и удаляет ее из очереди | 
| `once` | Функция | Выполняет переданную в качестве аргумента функцию один раз, передавая ей в качестве параметра объект MMDS |
| `whenActive` | Функция | Выполняет переданную в качестве аргумента функцию как только окно оказывается в фокусе |
| `updateViews` | Функция | Обновляет все представления на странице |
| `refresh` | Функция | Обновляет представление документа | 
| `reload` | Функция | Загружает текущий документ заново |
| `on`  | Функция | Устанавливает обработчик события (см. ниже) |
| `onMany` | Функция | Устанавливает один обработчик на массив событий |
| `off` | Функция | Убирает заданный обработчик |

## Обработка событий

* `on(eventId , handler) => handlerId`
* `onMany([eventId , ...] , handler) => [handlerId , ...]`
* `off(handlerId) => void`

## События

| eventId | Что означает |
|------|---------|
| ready  | Документ отображен |
| editor_redraw | Редактор обновлен |
| views_updated | Все представление обновлены |


 

