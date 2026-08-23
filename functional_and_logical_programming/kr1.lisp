;; Задача 1
(defun and4 (x1 x2 x3 x4)
  (if x1
      (if x2
          (if x3
              x4
              nil)
          nil)
      nil))

(defun or4 (x1 x2 x3 x4)
    (if x1
        x1
        (if x2
            x2
            (if x3
                x3
                (if x4
                    x4)))))


;; Задача 2 — последний элемент списка

(defun last-elem (lst)
(if (null (rest lst))      ; остался один элемент?
    (first lst)            ;   да → это ответ
    (last-elem (rest lst)))) ; нет → ищем в хвосте

;; Задача 3 — повтор элемента n раз
(defun repeat (x n)
(if (= n 0)
    nil                        ; копий не осталось — пустой список
    (cons x (repeat x (- n 1))))) ; один x + остальные (n-1)
