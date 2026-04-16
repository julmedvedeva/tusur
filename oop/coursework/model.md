  flowchart TD
      A([Начало]) --> B[Вывод меню]
      B --> C[/Ввод выбора/]
      C --> D{выбор != 0?}
      D -->|Нет| E([Конец])
      D -->|Да| F{выбор == 1?}
      F -->|Да| G[[subtractSeconds]]
      F -->|Нет| H{выбор == 2?}
      H -->|Да| I[[secondsBetween]]
      H -->|Нет| J[[demonstrate]]
      G --> B
      I --> B
      J --> B
