import { average } from './utils/func-utils';
import { generateRandomImagePath } from './db/image-paths';
import { queryElastic } from './db/elastic';

export const runPerformanceTests = () => {
    console.log('running performance tests');
    const queries = [];
    for (let i = 0; i < 10000; i++) {
        queries.push(
            queryElastic(generateRandomImagePath()).then(
                results => ({ doc2vec: results.doc2vec.body.took, tfIdf: results.tfIdf.body.took }),
                error => console.log(error)
            )
        );
    }
    Promise.all(queries).then(results => {
        const tfIdfResults = average(results.map(({ tfIdf }) => tfIdf));
        const doc2vecResults = average(results.map(({ doc2vec }) => doc2vec));

        console.log('DONE running performance tests');
        console.log('tfIdfResults average', tfIdfResults);
        console.log('doc2vecResults average', doc2vecResults);
    });
};
