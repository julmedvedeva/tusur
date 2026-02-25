import { Modal, Button, Form, Alert, Badge, Dropdown } from 'react-bootstrap';
import { useState, useEffect, useRef } from 'react';

const applySnilsMask = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  let result = digits.slice(0, 3);
  if (digits.length > 3) result += '-' + digits.slice(3, 6);
  if (digits.length > 6) result += '-' + digits.slice(6, 9);
  if (digits.length > 9) result += ' ' + digits.slice(9, 11);
  return result;
};

const applyPhoneMask = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  let result = '+' + digits.slice(0, 1);
  if (digits.length > 1) result += '-' + digits.slice(1, 4);
  if (digits.length > 4) result += '-' + digits.slice(4, 7);
  if (digits.length > 7) result += '-' + digits.slice(7, 9);
  if (digits.length > 9) result += '-' + digits.slice(9, 11);
  return result;
};

function FormModal({ show, onHide, title, fields, initialData, onSubmit }) {
  const [formData, setFormData] = useState(initialData || {});
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const errorRef = useRef(null);

  useEffect(() => {
    if (show) {
      setFormData(initialData || {});
      setError(null);
      setFieldErrors({});
    }
  }, [show, initialData]);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      fields.forEach(f => {
        if (f.derive?.from === name) {
          updated[f.name] = f.derive.using(value);
        }
      });
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Обрезать пробелы для всех текстовых полей
    const trimmedData = Object.keys(formData).reduce((acc, key) => {
      const value = formData[key];
      acc[key] = typeof value === 'string' ? value.trim() : value;
      return acc;
    }, {});

    const errors = {};
    fields.forEach(field => {
      if (field.mask === 'snils' && trimmedData[field.name]) {
        const digits = trimmedData[field.name].replace(/\D/g, '');
        if (digits.length !== 11) {
          errors[field.name] = 'СНИЛС должен содержать 11 цифр';
        }
      }
      if (field.mask === 'phone' && trimmedData[field.name]) {
        const digits = trimmedData[field.name].replace(/\D/g, '');
        if (digits.length !== 11) {
          errors[field.name] = 'Телефон должен содержать 11 цифр';
        }
      }
    });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setSaving(true);
    try {
      await onSubmit(trimmedData);
      onHide();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert ref={errorRef} variant="danger">{error}</Alert>}
          {fields.map(field => (
            <Form.Group className="mb-3" key={field.name}>
              <Form.Label>{field.label}</Form.Label>
              {field.type === 'select' ? (
                <>
                  <Form.Select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    disabled={field.disabled}
                  >
                    <option value="">Выберите...</option>
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Form.Select>
                  {field.hint && formData[field.name] && (
                    <div className="mt-1">{field.hint(formData[field.name])}</div>
                  )}
                </>
              ) : field.type === 'custom-select' ? (() => {
                const selected = field.options?.find(o => String(o.value) === String(formData[field.name]));
                return (
                  <>
                    <input type="hidden" name={field.name} value={formData[field.name] || ''} required={field.required} />
                    <Dropdown>
                      <Dropdown.Toggle
                        variant="outline-secondary"
                        className="w-100 text-start d-flex align-items-center justify-content-between"
                        disabled={field.disabled}
                      >
                        <span className="d-flex align-items-center gap-2">
                          {selected ? (
                            <>
                              {selected.badgeLabel && (
                                <Badge bg={selected.badgeVariant || 'secondary'}>{selected.badgeLabel}</Badge>
                              )}
                              <span>{selected.label}</span>
                            </>
                          ) : 'Выберите...'}
                        </span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu style={{ maxHeight: '260px', overflowY: 'auto', width: '100%' }}>
                        {field.options?.map(opt => (
                          <Dropdown.Item
                            key={opt.value}
                            className="d-flex align-items-center gap-2"
                            active={String(formData[field.name]) === String(opt.value)}
                            onClick={() => handleChange({ target: { name: field.name, value: String(opt.value) } })}
                          >
                            {opt.badgeLabel && (
                              <Badge bg={opt.badgeVariant || 'secondary'}>{opt.badgeLabel}</Badge>
                            )}
                            {opt.label}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </>
                );
              })() : field.mask === 'snils' ? (
                <>
                  <Form.Control
                    type="text"
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => {
                      const formatted = applySnilsMask(e.target.value);
                      setFormData(prev => ({ ...prev, [field.name]: formatted }));
                      if (fieldErrors[field.name]) setFieldErrors(prev => ({ ...prev, [field.name]: null }));
                    }}
                    required={field.required}
                    placeholder="___-___-___ __"
                    maxLength={14}
                    isInvalid={!!fieldErrors[field.name]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors[field.name]}
                  </Form.Control.Feedback>
                </>
              ) : field.mask === 'phone' ? (
                <>
                  <Form.Control
                    type="text"
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => {
                      const formatted = applyPhoneMask(e.target.value);
                      setFormData(prev => ({ ...prev, [field.name]: formatted }));
                      if (fieldErrors[field.name]) setFieldErrors(prev => ({ ...prev, [field.name]: null }));
                    }}
                    required={field.required}
                    placeholder="+_-___-___-__-__"
                    maxLength={16}
                    isInvalid={!!fieldErrors[field.name]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors[field.name]}
                  </Form.Control.Feedback>
                </>
              ) : field.type === 'textarea' ? (
                <Form.Control
                  as="textarea"
                  rows={3}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                />
              ) : (
                <Form.Control
                  type={field.type || 'text'}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  placeholder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                />
              )}
            </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Отмена</Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default FormModal;
