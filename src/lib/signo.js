const moment = require('moment');
const  wiki  = require('wikijs').default;

const SIGNOS = () => {
    return [
        {
            signo: 'Aquarius \u{2652}',
            meses: [1, 2],
            dias: [20, 18],
            name: 'aquarius',
            image: ('./src/assets/signos/aquarius.png'),
        },
        {
            signo: 'Pisces \u{2653}',
            meses: [2, 3],
            dias: [19, 20],
            name: 'pisces',
            image: ('./src/assets/signos/pisces.png'),
        },
        {
            signo: 'Aries \u{2648}',
            meses: [3, 4],
            dias: [21, 19],
            name: 'aries',
            image: ('./src/assets/signos/aries.png'),
        },
        {
            signo: 'Taurus \u{2649}',
            meses: [4, 5],
            dias: [20, 20],
            name: 'taurus',
            image: ('./src/assets/signos/taurus.png'),
        },
        {
            signo: 'Gemini \u{264A}',
            meses: [5, 6],
            dias: [21, 21],
            name: 'gemini ',
            image: ('./src/assets/signos/gemini.png'),
        },
        {
            signo: 'Cancer \u{264B}',
            meses: [6, 7],
            dias: [22, 22],
            name: 'cancer',
            image: ('./src/assets/signos/cancer.png'),
        },
        {
            signo: 'Leo \u{264C}',
            meses: [7, 8],
            dias: [23, 22],
            name: 'leo',
            image: ('./src/assets/signos/leo.png'),
        },
        {
            signo: 'Virgo \u{264D}',
            meses: [8, 9],
            dias: [23, 22],
            name: 'virgo',
            image: ('./src/assets/signos/virgo.png'),
        },
        {
            signo: 'Libra \u{264E}',
            meses: [9, 10],
            dias: [23, 22],
            name: 'libra',
            image: ('./src/assets/signos/libra.png'),
        },
        {
            signo: 'Scorpio \u{264F}',
            meses: [10, 11],
            dias: [23, 21],
            name: 'scorpio',
            image: ('./src/assets/signos/scorpio.png'),
        },
        {
            signo: 'Sagittarius \u{2650}',
            meses: [11, 12],
            dias: [22, 21],
            name: 'sagittarius',
            image: ('./src/assets/signos/sagittarius.png'),
        },
        {
            signo: 'Capricornus \u{2651}',
            meses: [12, 12],
            dias: [19, 31],
            name: 'capricornus',
            image: ('./src/assets/signos/capricornus.png'),
        },
        {
            signo: 'Capricornus \u{2651}',
            meses: [1, 1],
            dias: [1, 19],
            name: 'capricornus',
            image: ('./src/assets/signos/capricornus.png'),
        },
    ];
};

const getSigno = (dt) => {
    const dataNascimento = moment(dt);
    console.log('signo', dataNascimento);
    for (const o of SIGNOS()) {
        let dia = (dataNascimento.month() + 1) * 100 + dataNascimento.date();
        if (
            dia >= o['meses'][0] * 100 + o['dias'][0] &&
            dia <= o['meses'][1] * 100 + o['dias'][1]
        ) {
            return o;
        }
    }
};

const retira_acentos = (str) => {
    let com_acento =
        'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝŔÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿŕ';

    let sem_acento =
        'AAAAAAACEEEEIIIIDNOOOOOOUUUUYRsBaaaaaaaceeeeiiiionoooooouuuuybyr';
    let novastr = '';
    for (let i = 0; i < str.length; i++) {
        let troca = false;
        for (let a = 0; a < com_acento.length; a++) {
            if (str.substr(i, 1) == com_acento.substr(a, 1)) {
                novastr += sem_acento.substr(a, 1);
                troca = true;
                break;
            }
        }
        if (troca == false) {
            novastr += str.substr(i, 1);
        }
    }
    return novastr;
};

const sanitize = (nome) => {
    return retira_acentos(nome.trim().toLowerCase().replace(/\s+/gim, ' '));
};

const consultaWiki = async (nome) => {
    return await wiki({ apiUrl: 'https://en.wikipedia.org/w/api.php' })
        .find(nome)
        .then(async (page) => {

            let info = await page.info();
            let imagem = await page.mainImage();
            let url = page.url();
            console.log(info);
            return {
                info: { fullName: info.fullName , name: info.bithName  , birthDate: info.birthDate, age: info.age },
                imagem,
                url
            }

        })
        .catch((e) => JSON.stringify(e));
};

const pesquisa = async (_nome) => {
    const nome = sanitize(_nome);
    console.log("pesquisa", nome);
    let resp = await consultaWiki(nome);

    try {
        var signo = undefined;
        if (resp.info?.birthDate?.date) {
            signo = getSigno(new Date(resp.info?.birthDate?.date));
        }
        return { ...resp, signo };
    } catch (error) {
        return { error: error.message };
    }
};

const sugestao = async (_nome) => {
    const nome = sanitize(_nome);
    const list = await wiki({ apiUrl: 'https://en.wikipedia.org/w/api.php' })
        .search(`${nome}`, 10, true);
    return list.results;
};


module.exports = { sugestao, pesquisa }