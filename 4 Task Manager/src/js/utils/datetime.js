export default class Datetime {
    static getStrDate(datetime = new Date) {return (datetime).toLocaleDateString('ru', {day:'numeric', month:'numeric', year:'numeric'})}

    static isDatetimeValid(datetime) {
        if(!this.checkDatetimeFormat(datetime)) return false; //формат верный?
    
        let [day, time] = datetime.split(' ')
        day = day.split('.')
        day = `${day[1]}.${day[0]}.${day[2]}`
        datetime = time+' '+day
    
        const [endDate, curDate] = [new Date(datetime), new Date()]
        return endDate > curDate    // время уже прошло?
    }
    /* datetime - формата dd.mm.yyyy hh:mm */
    static checkDatetimeFormat(datetime) { 
        if(typeof datetime != 'string' || datetime.length != 16) return false;
    
        const day = datetime.slice(0,2)
        if(isNaN(Number(day)) || Number(day) > 31) return false;
    
        if(datetime.slice(2,3)!='.') return false;
        
        const month = datetime.slice(3,5)
        if(isNaN(Number(month)) || Number(month) > 12) return false;
        
        if(datetime.slice(5,6)!='.') return false;
        
        const year = datetime.slice(6,10)
        if(isNaN(Number(year))) return false;
        
        if(datetime.slice(10,11)!=' ') return false;
    
        const hour = datetime.slice(11,13)
        if(isNaN(Number(hour))|| Number(hour) >= 24) return false;
    
        if(datetime.slice(13,14)!=':') return false;
    
        const minutes = datetime.slice(14,16)
        if(isNaN(Number(minutes)) || Number(minutes) >= 60) return false;
        
        return true
    }
    static formDatetime(datetime) {
        let [date, time] = datetime.split('T')
        date = date.split('-').reverse().join('.')
        return `${date} ${time}`
    }
}