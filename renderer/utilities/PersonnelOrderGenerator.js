import {
    GenerateFullTitleByTitleIndex,
    GenerateName,
    GenerateRankName,
    GenerateServantRankNameAndTitle,
} from "./ServantsGenerators";

const groupPull = pull => {
    if (!Array.isArray(pull)) return [];
    return pull.reduce((acc, record) => {
        switch (record.clause_type) {
            case "rank_change": {
                if (!acc[record.clause_type]) acc[record.clause_type] = {};
                if (!acc[record.clause_type][record.new_rank]) acc[record.clause_type][record.new_rank] = [];
                acc[record.clause_type][record.new_rank].push(record);
                break;
            }
            case "contract": {
                if (!acc[record.clause_type]) acc[record.clause_type] = {};
                if (!acc[record.clause_type][record.reason]) acc[record.clause_type][record.reason] = [];
                acc[record.clause_type][record.reason].push(record);
                break;
            }
            default:
                if (!acc[record.clause_type]) acc[record.clause_type] = [];
                acc[record.clause_type].push(record);
                break;
        }
        return acc;
    }, {})
}

export default function generatePersonnelOrder(pull) {
    let text_block = "";
    let paragraph_no = 1;
    let clause_no = 1;
    const groupedPull = groupPull(pull);
    if (groupedPull.rank_change) {
        text_block += `§ ${ paragraph_no++ }\n`;
        let newRanks = Object.keys(groupedPull.rank_change);
        newRanks.sort();
        let isMultipleClauses = groupedPull.rank_change[newRanks[0]][0].clauses_no.indexOf(" ") !== -1;
        let isMultipleServants = newRanks.length > 1 || groupedPull.rank_change[newRanks[0]].length > 1;
        text_block += `${ isMultipleServants ? "" : clause_no++ + ". " }Відповідно до пункт${isMultipleClauses ? "ів" : "у"} ` +
            `${groupedPull.rank_change[newRanks[0]][0].clauses_no} Положення про проходження громадянами України ` +
            `військової служби у Збройних Силах України ` + ( isMultipleServants
                ? `нижчепойменованим особам рядового, сержантського і старшинського складу Збройних Сил України ПРИСВОЇТИ чергові військові звання:\n`
                : GenerateServantRankNameAndTitle(groupedPull.rank_change[newRanks[0]][0].servant_id, "dative", "full") +
                    ` ПРИСВОЇТИ чергове військове звання `
            )

        for (let rank of newRanks) {
            text_block += `«${GenerateRankName(rank, "", "nominative").toUpperCase()}»${ isMultipleServants ? "" : "." }\n`
            let servant_clauses = groupedPull.rank_change[rank];
            servant_clauses.sort((a, b) => {
                if (GenerateName(a.servant_id, "nominative", "full") < GenerateName(b.servant_id, "nominative", "full"))
                    return -1;
                if (GenerateName(a.servant_id, "nominative", "full") > GenerateName(b.servant_id, "nominative", "full"))
                    return 1
                return 0;
            })
            for (let servant of servant_clauses) {
                if (isMultipleServants) {
                    let fullServant = GenerateServantRankNameAndTitle(servant.servant_id, "dative", "full");
                    text_block += `${ clause_no++ }. ${ fullServant[0].toLocaleUpperCase() + fullServant.slice(1) }.\n`;
                }
                text_block += `${ servant.year_of_birth } р.н., вислуга у званні - ${ servant.service_period },\n${ servant.VAT }.\n`
            }
        }
        text_block += "\n";
    }
    if (groupedPull.reassignment) {
        let isPlural = groupedPull.reassignment.length > 1;
        text_block += `§ ${ paragraph_no++ }\n${ isPlural ? "" : clause_no++ + ". " }Відповідно до пункту ___ Положення про ` +
            `проходження громадянами України військової служби у Збройних Силах України ${ isPlural 
                ? "нижчепойменованих осіб сержантського, старшинського та рядового складу" 
                : GenerateServantRankNameAndTitle(groupedPull.reassignment[0].servant_id, "accusative", "full") }` +
            ` ЗВІЛЬНИТИ з займан${isPlural ? "их" : "ої"} посад${isPlural ? "" : "и"} і ПРИЗНАЧИТИ${ isPlural 
                ? ":\n"
                : " " + GenerateFullTitleByTitleIndex(groupedPull.reassignment[0].new_title_index, "instrumental").toUpperCase() + 
                    ", ВОС – " + groupedPull.reassignment[0].MOS + ".\n"}`;

        const generateReassignmentDetailsBlock = servantRecord => {
            let result = `${servantRecord.year_of_birth} р.н., освіта: ${servantRecord.education}, ` +
                `у ЗС – з ${servantRecord.service_period}.\n${servantRecord.VAT}.\nПризначається на `;
            if (servantRecord.position_category < servantRecord.new_position_category)
                result += "вищу";
            else if (servantRecord.position_category > servantRecord.new_position_category)
                result += "нижчу";
            else result += "рівнозначну";
            result += ` посаду у зв’язку із проведенням організаційних заходів з шпк "` +
                GenerateRankName(servantRecord.position_category, "", "nominative") + `" на шпк "` +
                `${GenerateRankName(servantRecord.new_position_category, "", "nominative")}".\n`;
            return result;
        }

        if (!isPlural)
            text_block += generateReassignmentDetailsBlock(groupedPull.reassignment[0]);
        else {
            for (let servant of groupedPull.reassignment) {
                let fullServant = GenerateServantRankNameAndTitle(servant.servant_id, "accusative", "full");
                text_block += clause_no++ + ". " + fullServant[0].toLocaleUpperCase() + fullServant.slice(1) + " – " +
                    GenerateFullTitleByTitleIndex(servant.new_title_index, "instrumental").toUpperCase() +
                    ", ВОС – " + servant.MOS + ".\n";
                text_block += generateReassignmentDetailsBlock(servant);
            }
        }
    }
    if (groupedPull.contract) {
        if (groupedPull.contract.new_contract) {
            text_block += `§ ${ paragraph_no++ }\n`;
            if (groupedPull.contract.new_contract.length > 1) {
                text_block += `Відповідно до частини ___ статті ___ Закону України "Про військовий ` +
                    `обов’язок і військову службу" з нижчепойменованими особами рядового, сержантського і старшинського складу` +
                    ` УКЛАСТИ новий контракт про проходження громадянами України військової служби у Збройних Силах України на ` +
                    `посадах осіб рядового, сержантського і старшинського складу:\n`;
                for (let servant of groupedPull.contract.new_contract) {
                    let fullServant = GenerateServantRankNameAndTitle(servant.servant_id, "instrumental", "full");
                    text_block += `${clause_no++}. ${ fullServant[0].toLocaleUpperCase() + fullServant.slice(1) }.\n` +
                        `${ servant.year_of_birth } р.н.\t${ servant.VAT },\n${ servant.service_period }.\n`;
                }
            } else {
                let servant = groupedPull.contract.new_contract[0];
                let fullServant = GenerateServantRankNameAndTitle(servant.servant_id, "instrumental", "full");
                text_block += `${clause_no++}. Відповідно до частини ___ статті ___ Закону України "Про військовий обов’язок і ` +
                    `військову службу" з ${ fullServant }, УКЛАСТИ новий контракт про проходження громадянами України ` +
                    `військової служби у Збройних Силах України на посадах осіб рядового, сержантського і старшинського складу` +
                    ` ${ servant.service_period }.\n${ servant.year_of_birth } р.н.\t${ servant.VAT }.\n`;
            }

        }
        if (groupedPull.contract.prolongation) {
            text_block += `§ ${ paragraph_no++ }\n`;
            if (groupedPull.contract.prolongation.length > 1) {
                text_block += `Відповідно до частини ___ статті ___ Закону України "Про військовий ` +
                    `обов’язок і військову службу" з нижчепойменованими особами рядового, сержантського і старшинського складу` +
                    ` ПРОДОВЖИТИ строк попереднього контракту про проходження громадянами України військової служби у Збройних ` +
                    `Силах України на посадах осіб рядового, сержантського і старшинського складу:\n`;
                for (let servant of groupedPull.contract.prolongation) {
                    let fullServant = GenerateServantRankNameAndTitle(servant.servant_id, "instrumental", "full");
                    text_block += `${clause_no++}. ${ fullServant[0].toLocaleUpperCase() + fullServant.slice(1) }.\n` +
                        `${ servant.year_of_birth } р.н.\t${ servant.VAT },\n${ servant.service_period }.\n`;
                }
            } else {
                let servant = groupedPull.contract.prolongation[0];
                let fullServant = GenerateServantRankNameAndTitle(servant.servant_id, "instrumental", "full");
                text_block += `${clause_no++}. Відповідно до частини ___ статті ___ Закону України "Про військовий обов’язок і ` +
                    `військову службу" з ${ fullServant }, ПРОДОВЖИТИ строк попереднього контракту про проходження громадянами України ` +
                    `військової служби у Збройних Силах України на посадах осіб рядового, сержантського і старшинського складу` +
                    ` ${ servant.service_period }.\n${ servant.year_of_birth } р.н.\t${ servant.VAT }.\n`;
            }
        }
    }
    return text_block;
}