
import type { Specialty } from '../types';
import { specialtyImages } from './assets';

// Priority list of rules. 
// The function will iterate through this list and pick the FIRST match.
// Put specific phrases (e.g., "информационное моделирование") BEFORE general words (e.g., "моделирование").
const SEMANTIC_RULES: { keywords: string[], imageUrl: string }[] = [
    // --- IT & Electronics ---
    { 
        keywords: ['информационное моделирование', 'bim'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/BIM.jpg' 
    },
    { 
        keywords: ['кибер', 'безопасность', 'защита информации'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Itsecurity.jpg' 
    },
    { 
        keywords: ['программист', 'программирование', 'разработчик', 'кодирование', 'информационные системы', 'компьютерные системы', 'сетевое', 'администрирование', 'интеллектуальные'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Koder).jpg' 
    },
    { 
        keywords: ['робот', 'мехатроника'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Roboto.jpg' 
    },
    { 
        keywords: ['3d', 'аддитивные', 'прототипирование'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/3D).jpg' 
    },
    { 
        keywords: ['графический дизайнер', 'графический дизайн', 'дизайн'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/CGI.jpg' 
    },
    
    // --- Industry & Manufacturing ---
    { 
        keywords: ['чпу', 'станков', 'металлообрабатывающих'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/CHPU.jpg' 
    },
    { 
        keywords: ['свар', 'сварочн'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Swarka.jpg' 
    },
    { 
        keywords: ['металлург', 'сталь', 'прокат', 'сплав', 'коксо', 'литейное'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Metalurg.jpg' 
    },
    { 
        keywords: ['электрон', 'электрик', 'электромонтер', 'электроснабжение', 'электрооборудов', 'электротехнические'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/ElectroMontazg.jpg' 
    },
    { 
        keywords: ['технология машиностроения', 'машиностроение'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Mashinostroenie.jpg' 
    },
    { 
        keywords: ['слесарь', 'монтаж промышленного', 'ремонт промышленного', 'эксплуатация оборудования', 'гидравлическ', 'пневматическ'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/PromRemont.jpg' 
    },
    { 
        keywords: ['холодильн', 'кондиционир'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Holodilnik.jpg' 
    },
    { 
        keywords: ['горные', 'шахт', 'разрез'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Gornyak.jpg' 
    },

    // --- Transport & Logistics ---
    { 
        keywords: ['помощник машиниста', 'локомотив', 'подвижного состава', 'железнодорож'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Mashinist.jpg' 
    },
    { 
        keywords: ['проводник', 'вагон'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/RGD).jpg' 
    },
    { 
        keywords: ['логист', 'логистика', 'организация перевозок'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Logist.jpg' 
    },
    { 
        keywords: ['дорож', 'автомобильных дорог', 'аэродромов'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Dorozg.jpg' 
    },
    { 
        keywords: ['крановщик', 'кран'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Kranovshik.jpg' 
    },
    { 
        keywords: ['авто', 'механик', 'трактор', 'ремонт автомобилей', 'двигател', 'машинист'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/AvtoStroit.jpg' 
    },

    // --- Construction & ЖКХ ---
    { 
        keywords: ['архитектура', 'архитектор'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Architector.jpg' 
    },
    { 
        keywords: ['газ', 'газоснаб', 'газораспредел'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Gazovchik.jpg' 
    },
    { 
        keywords: ['ландшафт', 'садово-парк'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Landshaft.jpg' 
    },
    { 
        keywords: ['столяр', 'мебел'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Mebel.jpg' 
    },
    { 
        keywords: ['отделочн', 'маляр', 'штукатур', 'плиточник', 'декоратив'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Shtukatur.jpg' 
    },
    { 
        keywords: ['строит', 'зданий', 'сооружений', 'каменщик', 'бетонщик'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Stroitel.jpg' 
    },

    // --- Service, Art, Culture ---
    { 
        keywords: ['чрезвычайных', 'мчс', 'спасатель', 'пожарн', 'защита в'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Mchs).jpg' 
    },
    { 
        keywords: ['полиция', 'правоохранитель', 'юрист', 'право'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Police.jpg' 
    },
    { 
        keywords: ['красота', 'парикмахер', 'стилист', 'эстетика', 'визаж'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Parik.jpg' 
    },
    { 
        keywords: ['библиотек'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Biblio.jpg' 
    },
    { 
        keywords: ['организатор', 'культурно-досугов', 'социально-культурн'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Organizator.jpg' 
    },
    { 
        keywords: ['народное', 'творчество', 'этно'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Cult.jpg' 
    },
    { 
        keywords: ['костюм', 'моделирование и технология', 'конструирование швейных'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/PoKost.jpg' 
    },
    { 
        keywords: ['реставрация'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Restovrator.jpg' 
    },
    { 
        keywords: ['художник', 'живопись', 'изобразительн'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Hudognik.jpg' 
    },
    
    // --- Music ---
    { 
        keywords: ['звукооператор', 'звукорежиссер', 'звукотехни'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/ZvukoReg).jpg' 
    },
    { 
        keywords: ['теория музыки', 'музыковед'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/IstoriaMusic.jpg' 
    },
    { 
        keywords: ['дирижер', 'хор', 'руководитель хора'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Dirizger.jpg' 
    },
    { 
        keywords: ['музык', 'инструмент', 'оркестр', 'фортепиано'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Musicant.jpg' 
    },
    { 
        keywords: ['вокал', 'пение', 'пев'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/PEvetc.jpg' 
    },

    // --- Food & Service ---
    { 
        keywords: ['туризм', 'гостеприим', 'отель'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Turism.jpg' 
    },
    { 
        keywords: ['повар', 'кондитер', 'пекарь', 'питани', 'кулинар'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Povar%20(1).jpg' 
    },
    { 
        keywords: ['реклам'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Reclama.jpg' 
    },
    
    // --- Education & Science ---
    { 
        keywords: ['физическая культура', 'физкультур', 'тренер', 'спорт', 'адаптивная'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Fizruk.jpg' 
    },
    { 
        keywords: ['дошкольное', 'начальных классов', 'преподавание в начальных', 'коррекционная', 'воспитатель'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/NachKlass.jpg' 
    },
    { 
        keywords: ['педагог', 'учитель', 'преподават', 'обучение'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Uchitel.jpg' 
    },
    { 
        keywords: ['лаборант', 'лабораторная', 'анализ', 'химическ'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Laborant.jpg' 
    },

    // --- Agriculture & Medicine ---
    { 
        keywords: ['ветеринар', 'кинолог', 'животн'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/veterenar.jpg' 
    },
    { 
        keywords: ['землеустро', 'кадастр', 'геодез'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Zemleustr.jpg' 
    },
    { 
        keywords: ['ремонт сельскохозяйственной', 'мастер сельскохозяйственного', 'эксплуатация и ремонт сельско'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/SelhosOborudovanie.jpg' 
    },
    { 
        keywords: ['хранения сельскохозяйственной', 'переработки'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/HranenieSelhos.jpg' 
    },
    { 
        keywords: ['садовод', 'агро', 'фермер', 'растен', 'лесн'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Sadowod.jpg' 
    },
    { 
        keywords: ['акушер'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/Akusher.jpg' 
    },
    { 
        keywords: ['врач', 'лечеб', 'мед', 'сестрин', 'фельдшер'], 
        imageUrl: 'https://yrlxygbsmfndcfntdmon.supabase.co/storage/v1/object/public/images/lechebnoe.jpg' 
    },
];

// Helper to get image or fallback
const getSemanticImage = (title: string) => {
    const lowerTitle = title.toLowerCase();
    
    for (const rule of SEMANTIC_RULES) {
        if (rule.keywords.some(keyword => lowerTitle.includes(keyword))) {
            return rule.imageUrl;
        }
    }

    // Fallback
    return specialtyImages['09.02.07']; 
};

const placeholderDetails = {
    dayInLife: 'Специалист выполняет профессиональные задачи, используя современное оборудование и программное обеспечение. Работа требует внимательности, ответственности и постоянного совершенствования навыков.',
    pros: ['Востребованность на рынке труда', 'Возможность карьерного роста', 'Достойная заработная плата'],
    cons: ['Высокий уровень ответственности', 'Необходимость постоянного обучения'],
    salary: {
        novice: { from: 25000, to: 40000 },
        experienced: { from: 45000, to: 90000 },
    },
    skills: ['Профессиональные знания', 'Работа в команде', 'Использование спец. оборудования', 'Соблюдение техники безопасности'],
    careerTrack: [
        { step: 1, title: 'Младший специалист' },
        { step: 2, title: 'Квалифицированный специалист' },
        { step: 3, title: 'Руководитель подразделения / Наставник' },
    ],
};

const rawSpecialties = [
    { id: '07.02.01', type: 'специальность', title: 'Архитектура', description: 'Проектирование зданий, интерьеров и городской среды.', fullDescription: 'Архитекторы занимаются проектированием зданий, созданием комфортной городской среды и интерьеров.', passingScore: 4.2, duration: '3 г. 10 мес.' },
    { id: '08.01.27', type: 'профессия', title: 'Мастер общестроительных работ', description: 'Выполнение каменных, печных и монтажных работ.', fullDescription: 'Рабочая профессия широкого профиля, включающая выполнение каменных, бетонных и монтажных работ при возведении зданий.', passingScore: 3.6, duration: '2 г. 10 мес.' },
    { id: '08.01.28', type: 'профессия', title: 'Мастер отделочных строительных и декоративных работ', description: 'Выполнение штукатурных, малярных и облицовочных работ.', fullDescription: 'Специалист по финишной отделке помещений: штукатурка, окраска, укладка плитки и декоративные покрытия.', passingScore: 3.7, duration: '2 г. 10 мес.' },
    { id: '08.02.01', type: 'специальность', title: 'Строительство и эксплуатация зданий и сооружений', description: 'Организация строительных работ и контроль качества.', fullDescription: 'Специалисты организуют строительные процессы, контролируют качество работ и занимаются эксплуатацией зданий.', passingScore: 4.0, duration: '3 г. 10 мес.' },
    { id: '08.02.08', type: 'специальность', title: 'Монтаж и эксплуатация оборудования и систем газоснабжения', description: 'Установка и обслуживание газового оборудования.', fullDescription: 'Техники занимаются проектированием, монтажом и эксплуатацией систем газораспределения и газопотребления.', passingScore: 4.1, duration: '3 г. 10 мес.' },
    { id: '08.02.12', type: 'специальность', title: 'Строительство и эксплуатация автомобильных дорог, аэродромов и городских путей сообщения', description: 'Строительство и ремонт дорожной инфраструктуры.', fullDescription: 'Специалисты в области дорожного строительства, отвечающие за возведение и ремонт дорог и аэродромов.', passingScore: 3.9, duration: '3 г. 10 мес.' },
    { id: '08.02.15', type: 'специальность', title: 'Информационное моделирование в строительстве', description: 'Создание цифровых двойников зданий (BIM-технологии).', fullDescription: 'Современное направление, связанное с созданием 3D-моделей зданий и управлением данными на всех этапах жизненного цикла объекта.', passingScore: 4.3, duration: '3 г. 10 мес.' },
    { id: '09.01.03', type: 'профессия', title: 'Оператор информационных систем и ресурсов', description: 'Обработка и ввод данных, оформление документации.', fullDescription: 'Специалист по обработке информации, работе с базами данных и цифровым контентом.', passingScore: 4.0, duration: '2 г. 10 мес.' },
    { id: '09.01.04', type: 'профессия', title: 'Наладчик аппаратных и программных средств инфокоммуникационных систем', description: 'Настройка компьютеров и периферийного оборудования.', fullDescription: 'Специалист по установке, настройке и обслуживанию компьютерной техники и программного обеспечения.', passingScore: 4.0, duration: '2 г. 10 мес.' },
    { id: '09.02.01', type: 'специальность', title: 'Компьютерные системы и комплексы', description: 'Проектирование и обслуживание компьютерных сетей.', fullDescription: 'Техники по компьютерным системам занимаются разработкой, производством и эксплуатацией аппаратного и программного обеспечения.', passingScore: 4.2, duration: '3 г. 10 мес.' },
    { id: '09.02.06', type: 'специальность', title: 'Сетевое и системное администрирование', description: 'Настройка серверов и обеспечение безопасности сети.', fullDescription: 'Администраторы отвечают за работу компьютерных сетей, серверов и информационную безопасность организации.', passingScore: 4.1, duration: '3 г. 10 мес.' },
    { id: '09.02.07', type: 'специальность', title: 'Информационные системы и программирование', description: 'Разработка программного обеспечения и веб-сайтов.', fullDescription: 'Разработчики создают программы, мобильные приложения и веб-сервисы, работают с базами данных.', passingScore: 4.4, duration: '3 г. 10 мес.' },
    { id: '09.02.08', type: 'специальность', title: 'Интеллектуальные интегрированные системы', description: 'Разработка систем с элементами искусственного интеллекта.', fullDescription: 'Создание и обслуживание систем, использующих технологии искусственного интеллекта и машинного обучения.', passingScore: 4.5, duration: '3 г. 10 мес.' },
    { id: '10.02.04', type: 'специальность', title: 'Обеспечение информационной безопасности телекоммуникационных систем', description: 'Защита сетей связи от кибератак.', fullDescription: 'Специалисты обеспечивают защиту данных, передаваемых по сетям связи, и предотвращают несанкционированный доступ.', passingScore: 4.3, duration: '3 г. 10 мес.' },
    { id: '10.02.05', type: 'специальность', title: 'Обеспечение информационной безопасности автоматизированных систем', description: 'Защита корпоративных и промышленных систем.', fullDescription: 'Разработка и внедрение мер по защите автоматизированных систем управления и баз данных.', passingScore: 4.3, duration: '3 г. 10 мес.' },
    { id: '11.02.17', type: 'специальность', title: 'Разработка электронных устройств и систем', description: 'Проектирование и создание электроники.', fullDescription: 'Специалисты занимаются разработкой схем, печатных плат и программного обеспечения для электронных устройств.', passingScore: 4.2, duration: '3 г. 10 мес.' },
    { id: '13.01.10', type: 'профессия', title: 'Электромонтер по ремонту и обслуживанию электрооборудования', description: 'Ремонт электрических сетей и оборудования.', fullDescription: 'Рабочий, обслуживающий силовые и осветительные электроустановки, электродвигатели и трансформаторы.', passingScore: 3.8, duration: '2 г. 10 мес.' },
    { id: '13.02.07', type: 'специальность', title: 'Электроснабжение', description: 'Обеспечение предприятий электроэнергией.', fullDescription: 'Техники-электрики занимаются монтажом, наладкой и эксплуатацией сетей электроснабжения.', passingScore: 4.0, duration: '3 г. 10 мес.' },
    { id: '13.02.13', type: 'специальность', title: 'Эксплуатация и обслуживание электрического и электромеханического оборудования (по отраслям)', description: 'Ремонт промышленного электрооборудования.', fullDescription: 'Специалисты обеспечивают бесперебойную работу электрических машин, станков и автоматических линий.', passingScore: 4.0, duration: '3 г. 10 мес.' },
    { id: '15.01.05', type: 'профессия', title: 'Сварщик (ручной и частично механизированной сварки (наплавки))', description: 'Сварка металлических конструкций.', fullDescription: 'Выполнение сварочных работ различными методами (дуговая, газовая, полуавтоматическая).', passingScore: 3.7, duration: '2 г. 10 мес.' },
    { id: '15.01.38', type: 'профессия', title: 'Оператор-наладчик металлообрабатывающих станков', description: 'Работа на станках с ЧПУ.', fullDescription: 'Управление современными станками с числовым программным управлением для обработки металлов.', passingScore: 3.9, duration: '2 г. 10 мес.' },
    { id: '15.02.03', type: 'специальность', title: 'Монтаж, техническое обслуживание и ремонт гидравлического и пневматического оборудования (по отраслям)', description: 'Работа с гидроприводами и пневматикой.', fullDescription: 'Обслуживание сложных гидравлических и пневматических систем промышленных машин.', passingScore: 3.9, duration: '3 г. 10 мес.' },
    { id: '15.02.06', type: 'специальность', title: 'Монтаж, техническая эксплуатация и ремонт холодильно-компрессорных и теплонасосных машин и установок (по отраслям)', description: 'Обслуживание холодильного оборудования.', fullDescription: 'Специалисты по промышленному холоду, кондиционированию и тепловым насосам.', passingScore: 3.8, duration: '3 г. 10 мес.' },
    { id: '15.02.09', type: 'специальность', title: 'Аддитивные технологии', description: '3D-печать и прототипирование.', fullDescription: 'Создание изделий методом послойного наращивания (3D-печать) из различных материалов.', passingScore: 4.1, duration: '3 г. 10 мес.' },
    { id: '15.02.10', type: 'специальность', title: 'Мехатроника и робототехника (по отраслям)', description: 'Создание и обслуживание роботов.', fullDescription: 'Проектирование, монтаж и эксплуатация мехатронных систем и промышленных роботов.', passingScore: 4.2, duration: '3 г. 10 мес.' },
    { id: '15.02.16', type: 'специальность', title: 'Технология машиностроения', description: 'Разработка процессов изготовления деталей.', fullDescription: 'Разработка технологических процессов механической обработки деталей и сборки машин.', passingScore: 4.0, duration: '3 г. 10 мес.' },
    { id: '15.02.17', type: 'специальность', title: 'Монтаж, техническое обслуживание, эксплуатация и ремонт промышленного оборудования (по отраслям)', description: 'Ремонт станков и механизмов.', fullDescription: 'Обеспечение работоспособности оборудования на производственных предприятиях.', passingScore: 3.9, duration: '3 г. 10 мес.' },
    { id: '15.02.19', type: 'специальность', title: 'Сварочное производство', description: 'Организация сварочных работ.', fullDescription: 'Технологи сварочного производства разрабатывают техпроцессы сварки и контролируют качество швов.', passingScore: 4.0, duration: '3 г. 10 мес.' },
    { id: '18.02.10', type: 'специальность', title: 'Коксохимическое производство', description: 'Производство кокса и химических продуктов.', fullDescription: 'Ведение технологического процесса коксования угля и улавливания химических продуктов.', passingScore: 3.8, duration: '3 г. 10 мес.' },
    { id: '18.02.12', type: 'специальность', title: 'Технология аналитического контроля химических соединений', description: 'Лабораторный анализ веществ.', fullDescription: 'Проведение химического и физико-химического анализа сырья и продукции в лабораториях.', passingScore: 4.1, duration: '3 г. 10 мес.' },
    { id: '19.02.11', type: 'специальность', title: 'Технология продуктов питания из растительного сырья', description: 'Производство хлеба, кондитерских изделий.', fullDescription: 'Организация производства хлебобулочных, макаронных и кондитерских изделий.', passingScore: 3.9, duration: '3 г. 10 мес.' },
    { id: '19.02.12', type: 'специальность', title: 'Технология продуктов питания животного происхождения', description: 'Переработка мяса и молока.', fullDescription: 'Технология производства мясных и молочных продуктов, колбас, консервов.', passingScore: 3.9, duration: '3 г. 10 мес.' },
    { id: '20.02.02', type: 'специальность', title: 'Защита в чрезвычайных ситуациях', description: 'Спасательные работы и ликвидация ЧС.', fullDescription: 'Подготовка спасателей для работы в МЧС и аварийно-спасательных службах.', passingScore: 4.5, duration: '3 г. 10 мес.' },
    { id: '21.02.15', type: 'специальность', title: 'Открытые горные работы', description: 'Добыча полезных ископаемых в карьерах.', fullDescription: 'Организация и ведение горных работ на карьерах и разрезах.', passingScore: 3.8, duration: '3 г. 10 мес.' },
    { id: '21.02.19', type: 'специальность', title: 'Землеустройство', description: 'Учет и планирование использования земель.', fullDescription: 'Проведение проектно-изыскательских работ для целей землеустройства и кадастра.', passingScore: 4.0, duration: '3 г. 10 мес.' },
    { id: '22.01.11', type: 'профессия', title: 'Оператор металлургического производства', description: 'Работа на металлургических агрегатах.', fullDescription: 'Ведение процессов выплавки, разливки и проката металла.', passingScore: 3.8, duration: '2 г. 10 мес.' },
    { id: '22.02.08', type: 'специальность', title: 'Металлургическое производство (по видам производства)', description: 'Технология получения металлов.', fullDescription: 'Организация процессов производства черных и цветных металлов.', passingScore: 4.0, duration: '3 г. 10 мес.' },
    { id: '23.01.01', type: 'профессия', title: 'Оператор транспортного терминала (машинист крана)', description: 'Управление грузоподъемными кранами.', fullDescription: 'Погрузочно-разгрузочные работы с использованием кранов (башенных, мостовых, козловых).', passingScore: 3.8, duration: '2 г. 10 мес.' },
    { id: '23.01.06', type: 'профессия', title: 'Машинист дорожных и строительных машин', description: 'Управление экскаваторами, бульдозерами.', fullDescription: 'Эксплуатация и обслуживание дорожно-строительной техники.', passingScore: 3.7, duration: '2 г. 10 мес.' },
    { id: '23.01.07', type: 'профессия', title: 'Машинист крана (крановщик)', description: 'Управление автомобильными кранами.', fullDescription: 'Выполнение работ по подъему и перемещению грузов автокранами.', passingScore: 3.8, duration: '2 г. 10 мес.' },
    { id: '23.01.08', type: 'профессия', title: 'Слесарь по ремонту строительных машин', description: 'Ремонт тракторов и спецтехники.', fullDescription: 'Техническое обслуживание и ремонт дорожно-строительных машин и тракторов.', passingScore: 3.6, duration: '2 г. 10 мес.' },
    { id: '23.01.09', type: 'профессия', title: 'Помощник машиниста (по видам подвижного состава железнодорожного транспорта)', description: 'Работа на локомотиве.', fullDescription: 'Управление локомотивом под руководством машиниста, обслуживание железнодорожного состава.', passingScore: 4.0, duration: '2 г. 10 мес.' },
    { id: '23.01.17', type: 'профессия', title: 'Мастер по ремонту и обслуживанию автомобилей', description: 'Автослесарь.', fullDescription: 'Диагностика и ремонт автомобилей, техническое обслуживание.', passingScore: 3.8, duration: '2 г. 10 мес.' },
    { id: '23.01.22', type: 'профессия', title: 'Проводник на железнодорожном транспорте', description: 'Обслуживание пассажиров в поездах.', fullDescription: 'Обеспечение комфорта и безопасности пассажиров в пути следования.', passingScore: 3.9, duration: '2 г. 10 мес.' },
    { id: '23.02.01', type: 'специальность', title: 'Организация перевозок и управление на транспорте (по видам)', description: 'Логистика и диспетчеризация транспорта.', fullDescription: 'Организация грузовых и пассажирских перевозок, управление движением.', passingScore: 4.1, duration: '3 г. 10 мес.' },
    { id: '23.02.02', type: 'специальность', title: 'Автомобиле- и тракторостроение', description: 'Производство автомобилей.', fullDescription: 'Технология производства и сборки автомобилей и тракторов.', passingScore: 4.0, duration: '3 г. 10 мес.' },
    { id: '23.02.06', type: 'специальность', title: 'Техническая эксплуатация подвижного состава', description: 'Ремонт и обслуживание поездов.', fullDescription: 'Обеспечение работоспособности железнодорожного подвижного состава.', passingScore: 4.0, duration: '3 г. 10 мес.' },
    { id: '23.02.07', type: 'специальность', title: 'Техническое обслуживание и ремонт автотранспортных средств', description: 'Углубленный ремонт автомобилей.', fullDescription: 'Организация процессов ТО и ремонта автомобилей, диагностика сложных неисправностей.', passingScore: 3.9, duration: '3 г. 10 мес.' },
    { id: '27.02.04', type: 'специальность', title: 'Автоматические системы управления', description: 'Автоматизация производства.', fullDescription: 'Разработка, монтаж и наладка систем автоматического управления.', passingScore: 4.2, duration: '3 г. 10 мес.' },
    { id: '29.01.04', type: 'профессия', title: 'Художник по костюму', description: 'Создание одежды и сценических костюмов.', fullDescription: 'Разработка эскизов и пошив костюмов для спектаклей, кино и модных показов.', passingScore: 4.0, duration: '2 г. 10 мес.' },
    { id: '29.02.10', type: 'специальность', title: 'Конструирование, моделирование и технология изготовления изделий легкой промышленности (по видам)', description: 'Дизайн и пошив одежды.', fullDescription: 'Разработка новых моделей одежды, обуви или аксессуаров и технология их производства.', passingScore: 3.9, duration: '3 г. 10 мес.' },
    { id: '31.02.01', type: 'специальность', title: 'Лечебное дело', description: 'Фельдшер.', fullDescription: 'Оказание лечебно-диагностической, медицинской помощи пациентам.', passingScore: 4.5, duration: '3 г. 10 мес.' },
    { id: '31.02.02', type: 'специальность', title: 'Акушерское дело', description: 'Помощь при родах и уход за новорожденными.', fullDescription: 'Оказание акушерско-гинекологической помощи беременным и роженицам.', passingScore: 4.4, duration: '2 г. 10 мес.' },
    { id: '31.02.03', type: 'специальность', title: 'Лабораторная диагностика', description: 'Медицинские анализы.', fullDescription: 'Проведение лабораторных исследований биоматериалов.', passingScore: 4.3, duration: '2 г. 10 мес.' },
    { id: '34.02.01', type: 'специальность', title: 'Сестринское дело', description: 'Медицинская сестра / Медбрат.', fullDescription: 'Оказание сестринской помощи, уход за пациентами, выполнение врачебных назначений.', passingScore: 4.3, duration: '2 г. 10 мес.' },
    { id: '35.01.15', type: 'профессия', title: 'Мастер по ремонту и обслуживанию электрооборудования в сельском хозяйстве', description: 'Сельский электрик.', fullDescription: 'Ремонт и обслуживание электрооборудования на сельскохозяйственных объектах.', passingScore: 3.7, duration: '2 г. 10 мес.' },
    { id: '35.01.26', type: 'профессия', title: 'Мастер растениеводства', description: 'Выращивание сельхозкультур.', fullDescription: 'Выполнение работ по возделыванию и уборке сельскохозяйственных культур.', passingScore: 3.6, duration: '2 г. 10 мес.' },
    { id: '35.01.27', type: 'профессия', title: 'Мастер сельскохозяйственного производства', description: 'Механизатор широкого профиля.', fullDescription: 'Управление тракторами, комбайнами, выполнение слесарных и ремонтных работ.', passingScore: 3.7, duration: '3 г. 10 мес.' },
    { id: '35.01.28', type: 'профессия', title: 'Мастер столярного и мебельного производства', description: 'Изготовление мебели и столярных изделий.', fullDescription: 'Изготовление мебели, окон, дверей и других изделий из дерева.', passingScore: 3.7, duration: '2 г. 10 мес.' },
    { id: '35.02.05', type: 'специальность', title: 'Агрономия', description: 'Технология растениеводства.', fullDescription: 'Организация производства продукции растениеводства, защита растений.', passingScore: 3.9, duration: '3 г. 10 мес.' },
    { id: '35.02.08', type: 'специальность', title: 'Электротехнические системы в агропромышленном комплексе (АПК)', description: 'Энергетика в сельском хозяйстве.', fullDescription: 'Монтаж и эксплуатация электрооборудования сельхозпредприятий.', passingScore: 3.9, duration: '3 г. 10 мес.' },
    { id: '35.02.12', type: 'специальность', title: 'Садово-парковое и ландшафтное строительство', description: 'Ландшафтный дизайн.', fullDescription: 'Проектирование и создание объектов ландшафтной архитектуры, озеленение.', passingScore: 4.0, duration: '3 г. 10 мес.' },
    { id: '35.02.16', type: 'специальность', title: 'Эксплуатация и ремонт сельскохозяйственной техники и оборудования', description: 'Инженер-механик с/х техники.', fullDescription: 'Обеспечение работоспособности машинно-тракторного парка.', passingScore: 3.8, duration: '3 г. 10 мес.' },
    { id: '35.02.20', type: 'специальность', title: 'Технология производства, первичной переработки и хранения сельскохозяйственной продукции', description: 'Хранение и переработка урожая.', fullDescription: 'Организация процессов производства, хранения и первичной переработки сельхозпродукции.', passingScore: 3.8, duration: '3 г. 10 мес.' },
    { id: '36.02.01', type: 'специальность', title: 'Ветеринария', description: 'Лечение животных.', fullDescription: 'Диагностика, лечение и профилактика заболеваний животных.', passingScore: 4.1, duration: '3 г. 10 мес.' },
    { id: '36.02.05', type: 'специальность', title: 'Кинология', description: 'Работа с собаками.', fullDescription: 'Разведение, выращивание и дрессировка собак.', passingScore: 4.0, duration: '3 г. 10 мес.' },
    { id: '38.02.03', type: 'специальность', title: 'Операционная деятельность в логистике', description: 'Управление грузопотоками.', fullDescription: 'Планирование и организация логистических процессов, управление цепями поставок.', passingScore: 4.0, duration: '2 г. 10 мес.' },
    { id: '40.02.02', type: 'специальность', title: 'Правоохранительная деятельность', description: 'Работа в полиции.', fullDescription: 'Обеспечение законности и правопорядка, предупреждение и пресечение правонарушений.', passingScore: 4.4, duration: '3 г. 6 мес.' },
    { id: '42.02.01', type: 'специальность', title: 'Реклама', description: 'Создание рекламных продуктов.', fullDescription: 'Разработка и производство рекламной продукции, организация рекламных кампаний.', passingScore: 4.1, duration: '3 г. 10 мес.' },
    { id: '43.01.09', type: 'профессия', title: 'Повар, кондитер', description: 'Приготовление пищи.', fullDescription: 'Приготовление широкого ассортимента кулинарных блюд и кондитерских изделий.', passingScore: 3.8, duration: '3 г. 10 мес.' },
    { id: '43.02.15', type: 'специальность', title: 'Поварское и кондитерское дело', description: 'Технолог общественного питания.', fullDescription: 'Организация процесса приготовления и приготовление сложной кулинарной продукции.', passingScore: 4.0, duration: '3 г. 10 мес.' },
    { id: '43.02.16', type: 'специальность', title: 'Туризм и гостеприимству', description: 'Работа в туриндустрии.', fullDescription: 'Предоставление турагентских и туроператорских услуг, гостиничный сервис.', passingScore: 4.0, duration: '2 г. 10 мес.' },
    { id: '43.02.17', type: 'специальность', title: 'Технология индустрии красоты', description: 'Парикмахерское искусство и эстетика.', fullDescription: 'Предоставление парикмахерских, косметических услуг, визаж и маникюр.', passingScore: 4.1, duration: '3 г. 10 мес.' },
    { id: '44.02.01', type: 'специальность', title: 'Дошкольное образование', description: 'Воспитатель в детском саду.', fullDescription: 'Воспитание и обучение детей дошкольного возраста в дошкольных образовательных организациях.', passingScore: 4.1, duration: '3 г. 10 мес.' },
    { id: '44.02.02', type: 'специальность', title: 'Преподавание в начальных классах', description: 'Учитель начальных классов.', fullDescription: 'Обучение и воспитание детей младшего школьного возраста.', passingScore: 4.2, duration: '3 г. 10 мес.' },
    { id: '44.02.03', type: 'специальность', title: 'Педагогика дополнительного образования', description: 'Руководитель кружка/секции.', fullDescription: 'Преподавание по дополнительным общеобразовательным программам (кружки, секции, студии).', passingScore: 4.0, duration: '3 г. 10 мес.' },
    { id: '44.02.04', type: 'специальность', title: 'Специальное дошкольное образование', description: 'Воспитатель для детей с ОВЗ.', fullDescription: 'Воспитание и обучение детей дошкольного возраста с ограниченными возможностями здоровья.', passingScore: 4.0, duration: '3 г. 10 мес.' },
    { id: '44.02.05', type: 'специальность', title: 'Коррекционная педагогика в начальном образовании', description: 'Учитель для детей с ОВЗ.', fullDescription: 'Обучение и воспитание детей младшего школьного возраста с ограниченными возможностями здоровья.', passingScore: 4.0, duration: '3 г. 10 мес.' },
    { id: '44.02.06', type: 'специальность', title: 'Профессиональное обучение (по отраслям)', description: 'Мастер производственного обучения.', fullDescription: 'Подготовка квалифицированных рабочих и служащих по профессиям.', passingScore: 3.9, duration: '3 г. 10 мес.' },
    { id: '49.02.01', type: 'специальность', title: 'Физическая культура', description: 'Учитель физкультуры, тренер.', fullDescription: 'Организация и проведение занятий по физическому воспитанию, спортивных тренировок.', passingScore: 4.0, duration: '3 г. 10 мес.' },
    { id: '51.02.01', type: 'специальность', title: 'Народное художественное творчество (по видам)', description: 'Руководитель творческого коллектива.', fullDescription: 'Руководство любительскими творческими коллективами, постановка народных праздников и обрядов.', passingScore: 4.2, duration: '3 г. 10 мес.' },
    { id: '51.02.02', type: 'специальность', title: 'Социально-культурная деятельность (по видам / организация культурно-досуговой деятельности)', description: 'Организатор культурных мероприятий.', fullDescription: 'Организация и постановка культурно-массовых мероприятий и театрализованных представлений.', passingScore: 4.1, duration: '3 г. 10 мес.' },
    { id: '51.02.03', type: 'специальность', title: 'Библиотечно-информационная деятельность', description: 'Библиотекарь.', fullDescription: 'Библиотечно-информационное обслуживание населения.', passingScore: 3.9, duration: '2 г. 10 мес.' },
    { id: '53.02.02', type: 'специальность', title: 'Музыкальное искусство эстрады (по видам)', description: 'Эстрадный артист.', fullDescription: 'Музыкально-исполнительская деятельность в жанрах эстрадной музыки.', passingScore: 4.4, duration: '3 г. 10 мес.' },
    { id: '53.02.03', type: 'специальность', title: 'Инструментальное исполнительство (по видам инструментов)', description: 'Музыкант-инструменталист.', fullDescription: 'Исполнение музыкальных произведений на различных инструментах сольно и в оркестре.', passingScore: 4.4, duration: '3 г. 10 мес.' },
    { id: '53.02.04', type: 'специальность', title: 'Вокальное искусство', description: 'Академический певец.', fullDescription: 'Сольное и ансамблевое академическое пение.', passingScore: 4.5, duration: '3 г. 10 мес.' },
    { id: '53.02.05', type: 'специальность', title: 'Сольное и хоровое народное пение', description: 'Народный певец.', fullDescription: 'Исполнение народных песен сольно, в хоре или ансамбле.', passingScore: 4.3, duration: '3 г. 10 мес.' },
    { id: '53.02.06', type: 'специальность', title: 'Хоровое дирижирование', description: 'Дирижер хора.', fullDescription: 'Руководство хоровыми коллективами.', passingScore: 4.3, duration: '3 г. 10 мес.' },
    { id: '53.02.07', type: 'специальность', title: 'Теория музыки', description: 'Теоретик, преподаватель муз. дисциплин.', fullDescription: 'Музыкально-теоретическая и преподавательская деятельность.', passingScore: 4.4, duration: '3 г. 10 мес.' },
    { id: '53.02.08', type: 'специальность', title: 'Музыкальное звукооператорское мастерство', description: 'Звукорежиссер.', fullDescription: 'Звукозапись, озвучивание музыкальных программ и концертов.', passingScore: 4.3, duration: '3 г. 10 мес.' },
    { id: '54.02.01', type: 'специальность', title: 'Дизайн (по отраслям)', description: 'Графический и средовой дизайн.', fullDescription: 'Разработка дизайн-проектов (графический дизайн, дизайн среды, промышленный дизайн).', passingScore: 4.2, duration: '3 г. 10 мес.' },
    { id: '54.02.04', type: 'специальность', title: 'Реставрация', description: 'Восстановление произведений искусства.', fullDescription: 'Консервация и реставрация произведений искусства и памятников культуры.', passingScore: 4.1, duration: '3 г. 10 мес.' },
    { id: '54.02.05', type: 'специальность', title: 'Живопись (по видам/станковая живопись)', description: 'Художник-живописец.', fullDescription: 'Создание произведений станковой живописи.', passingScore: 4.4, duration: '3 г. 10 мес.' },
];

export const mockSpecialties: Specialty[] = rawSpecialties.map(s => ({
    ...s,
    type: s.type as 'профессия' | 'специальность',
    details: placeholderDetails,
    imageUrl: getSemanticImage(s.title)
}));
