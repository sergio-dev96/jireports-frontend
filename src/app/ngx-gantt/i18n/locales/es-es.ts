import { GanttViewType } from '../../class';
import { GanttI18nLocale } from '../i18n';

export default {
    id: GanttI18nLocale.esEs,
    views: {
        [GanttViewType.hour]: {
            label: 'Por hora',
            dateFormats: {
                primary: 'd MMM',
                secondary: 'HH:mm'
            }
        },
        [GanttViewType.day]: {
            label: 'Diario',
            dateFormats: {
                primary: 'MMM yyyy',
                secondary: 'dd'
            }
        },
        [GanttViewType.week]: {
            label: 'Semanal',
            dateFormats: {
                primary: 'yyyy',
                secondary: 'wo'
            }
        },
        [GanttViewType.month]: {
            label: 'Mensual',
            dateFormats: {
                primary: "QQQ-yyyy",
                secondary: 'MMMM'
            }
        },
        [GanttViewType.quarter]: {
            label: 'Trimestral',
            dateFormats: {
                primary: 'yyyy',
                secondary: "QQQ-yyyy"
            }
        },
        [GanttViewType.year]: {
            label: 'Anual',
            dateFormats: {
                secondary: 'yyyy'
            }
        }
    }
};
