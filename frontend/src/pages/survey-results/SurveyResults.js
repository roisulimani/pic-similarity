import 'tui-chart/dist/tui-chart.css';

import React, { useEffect, useState } from 'react';

import ChartAverageRating from '../../components/chart-average-rating/ChartAverageRating';
import PieCategoryRatings from '../../components/pie-category-ratings/PieCategoryRatings';
import RangeSlider from '../../components/range-slider/RangeSlider';
import ScatterChartGoogleVision from '../../components/scatter-chart-google-vision/ScatterChartGoogleVision';
import { average } from '../../utils/func-utils';
import { firestore as db } from '../../config/firebase';

const SurveyResults = () => {
    const [scores, setScores] = useState(null);
    const [tfIdfRange, setTfIdfRange] = useState([80, 100]);
    const [doc2vecRange, setDoc2vecRange] = useState([80, 100]);

    useEffect(() => {
        db.collection('scores')
            .get()
            .then(results => {
                const s = results.docs.map(d => d.data());
                console.log('scoressss', s);
                setScores(s);
            });
    }, []);
    return scores ? (
        <div style={{ padding: 20 }}>
            <div>Number of surveys: {scores.length}</div>
            <div>
                {'TF-IDF average user rating: ' +
                    average(
                        scores.flatMap(score =>
                            score.tfIdf.results.map(res => average(Object.values(res.userRating.ratings)))
                        )
                    ).toFixed(1)}
            </div>
            <div>
                {'Doc2Vec average user rating: ' +
                    average(
                        scores.flatMap(score =>
                            score.doc2vec.results.map(res => average(Object.values(res.userRating.ratings)))
                        )
                    ).toFixed(1)}
            </div>
            <ScatterChartGoogleVision docs={scores} />
            <ChartAverageRating docs={scores} />
            <div>
                <RangeSlider range={tfIdfRange} setRange={setTfIdfRange} similarityAlgorithm="TF-IDF" />

                <PieCategoryRatings
                    range={tfIdfRange}
                    docs={scores}
                    similarityAlgorithm="tfIdf"
                    algorithmTitle="TF-IDF"
                />
                <RangeSlider range={doc2vecRange} setRange={setDoc2vecRange} similarityAlgorithm="Doc2Vec" />

                <PieCategoryRatings
                    range={doc2vecRange}
                    docs={scores}
                    similarityAlgorithm="doc2vec"
                    algorithmTitle="Doc2Vec"
                />
            </div>
        </div>
    ) : null;
};
export default SurveyResults;
