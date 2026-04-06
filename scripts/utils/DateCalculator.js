import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export class DateCalculator {
  static getDeliveryDate(deliveryDays, startDate = null) {
    let deliveryDate = startDate ? dayjs(startDate).clone() : dayjs();
    let daysAdded = 0;

    while (daysAdded < deliveryDays) {
      deliveryDate = deliveryDate.add(1, 'days');

      if (deliveryDate.day() !== 0 && deliveryDate.day() !== 6) {
        daysAdded += 1;
      }
    }

    return deliveryDate.format('dddd, MMMM D');
  }
}