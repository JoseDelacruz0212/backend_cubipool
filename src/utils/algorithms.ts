import *  as moment from "moment";
export const calculateDateForCron = (fecha: string, horaInicio: string, minutesBeforeActivation) => {



    let dayOfWeek = (moment(fecha).weekday());

    let hour = (parseInt(horaInicio.slice(0, 2)) + 5) % 24;
    let hourString = "";
    if (hour < 10) {
        hourString = ("0" + hour).toString()
    }
    else {
        hourString = hour.toString()
    }
    let differenceHour = moment(`${fecha}T${hourString}:00:00`)

    let horaActivation = (differenceHour.get('hours') - 1)



    return {
        dayOfWeek: dayOfWeek,

        horaAction: horaActivation,
        minutos: 45
    }

}
export const addPMorAM = (hour) => {

    return (hour >= 12) ? `${hour}:00pm` :
        (hour < 10) ? `0${hour}:00am` : `${hour}:00am`;
}