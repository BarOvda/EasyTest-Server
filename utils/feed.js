
const m = 1;


exports.bayesianScore = (summary, avg_sum) => {
    if (summary.usersRank != null && summary.rank != null) {
        const summays_number_of_rankers = summary.usersRank.length;
        let score = (summary.rank * summays_number_of_rankers + avg_sum * m) 
                    / (m + summays_number_of_rankers);
        console.log("-------bayesianScore-------")
        console.log(summary.rank)
        console.log(score)
        return score;
    }
    
    return 1;
}
