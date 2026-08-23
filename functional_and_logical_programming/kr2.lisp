;; Задача 1 — простое число
;; вспомогательная: n не делится ни на что от m до n-1
(defun ispr (n m)
  (if (= n m)
      t
      (and (ispr n (1+ m))
            (not (zerop (mod n m))))))

;; основная: n простое?
(defun prime (n)
  (ispr n 2))

;; Задача 2 — сортировка простой вставкой
;; вставить x в отсортированный список lst
(defun insert (x lst)
  (cond ((null lst) (list x))
        ((<= x (first lst)) (cons x lst))
        (t (cons (first lst) (insert x (rest lst))))))

(defun sort-ins (lst)
  (if (null lst)
      nil
      (insert (first lst) (sort-ins (rest lst)))))

;; Задача 3 — предикат all (функционалы)
  (defun all (p x)
    (cond ((null x) t)
          ((funcall p (first x)) (all p (rest x)))
          (t nil)))
