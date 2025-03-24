import React, { useEffect, useRef } from "react";
import { DatePicker, type DatePickerElement } from "@vaadin/react-components/DatePicker.js";

interface Props {
  id?: string;
  label?: string;
  locale?: "en" | "br";
  onValueChanged?: (event: CustomEvent<{ value: string }>) => void; // Evento original do Vaadin
}

const localeConfig = {
  en: {
    monthNames: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    today: "Today",
    cancel: "Cancel",
  },
  br: {
    monthNames: [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ],
    weekdays: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
    weekdaysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    today: "Hoje",
    cancel: "Cancelar",
    formatDate: (date: { day: number; month: number; year: number }) => {
      return `${String(date.day).padStart(2, "0")}/${String(date.month + 1).padStart(2, "0")}/${date.year}`;
    },
    parseDate: (text: string) => {
      const [day, month, year] = text.split("/").map(Number);
      return { day, month: month - 1, year };
    },
  },
};

const DatePickerI18n: React.FC<Props> = ({ id, label = "Data", locale = "en", onValueChanged }) => {
  const datePickerRef = useRef<DatePickerElement>(null);

  useEffect(() => {
    if (datePickerRef.current) {
      datePickerRef.current.i18n = { ...datePickerRef.current.i18n, ...localeConfig[locale] };
    }
  }, [locale]);

  return <DatePicker id={id} label={label} ref={datePickerRef} onValueChanged={onValueChanged} />;
};

export default DatePickerI18n;