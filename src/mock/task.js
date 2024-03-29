import {COLORS, DESCRIPTION, DEFAULT_REPEATING, Tags} from "../const.js";
import {getBooleanValue, getRandomElement, getRandomInteger} from "../utils/common";
import {nanoid} from "nanoid"

const generateDate = () => {
  // Когда в руках молоток, любая проблема - гвоздь.
  // Вот и для генерации случайного булевого значения
  // можно использовать "функцию из интернета".
  // Ноль - ложь, один - истина. Для верности приводим
  // к булевому типу с помощью Boolean
  const isDate = getBooleanValue();
  
  if (!isDate) {
    return null;
  }
  
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const currentDate = new Date();
  
  // По заданию дедлайн у задачи устанавливается без учёта времеми,
  // но объект даты без времени завести нельзя,
  // поэтому будем считать срок у всех задач -
  // это 23:59:59 установленной даты
  currentDate.setHours(23, 59, 59, 999);
  
  currentDate.setDate(currentDate.getDate() + daysGap);
  
  return new Date(currentDate);
};

const generateRepeating = () => {
  return {
    mo: false,
    tu: false,
    we: Boolean(getRandomInteger(0, 1)),
    th: false,
    fr: Boolean(getRandomInteger(0, 1)),
    sa: false,
    su: false
  };
};

const generateTags = (tags) => {
  return tags
    .filter(() => Math.random() > 0.5)
    .slice(0, 3)
}

export const generateTask = () => {
  const dueDate = generateDate();
  const repeating = dueDate === null ? generateRepeating() : DEFAULT_REPEATING;
  
  return {
    id: nanoid(),
    description: getRandomElement(DESCRIPTION),
    dueDate,
    repeating,
    tags: new Set(generateTags(Tags)),
    color: getRandomElement(COLORS),
    isArchive: getBooleanValue(),
    isFavorite: getBooleanValue()
  };
};