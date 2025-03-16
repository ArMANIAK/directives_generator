import {
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
            default:
                if (!acc[record.clause_type]) acc[record.clause_type] = [];
                acc.clause_type.push(record);
                break;
        }
        return acc;
    }, {})
}

export default function generatePersonnelOrder(pull) {
    let paragraph_no = 1;
    let clause_no = 1;
    let text_block = `§ ${ paragraph_no++ }\n`;
    const groupedPull = groupPull(pull);
    if (groupedPull.rank_change) {
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
    return text_block;
}