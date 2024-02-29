const regions = {
    'type': 'FeatureCollection',
    'features': [
        {
            'type': 'Feature',
            'properties': {
                'description':
                    'San Francisco - Oakland',
                'icon': 'theatre',
                'tag': 'SFO'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [-122.4644258, 37.7746271]
            }
        },
        {
            'type': 'Feature',
            'properties': {
                'description':
                    'Los Angeles',
                'icon': 'theatre',
                'tag': 'LA'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [-118.2498424, 34.049357]
            }
        },
        {
            'type': 'Feature',
            'properties': {
                'description':
                    'Philadelphia',
                'icon': 'theatre',
                'tag': 'PHL'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [-75.152857, 39.9496144]
            }
        },
        {
            'type': 'Feature',
            'properties': {
                'description':
                    'New York City',
                'icon': 'theatre',
                'tag': 'NYC'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [-73.9767493, 40.7670154]
            }
        },
        {
            'type': 'Feature',
            'properties': {
                'description':
                    'Boston',
                'icon': 'theatre',
                'tag': 'BOS'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [-71.059447, 42.3592836]
            }
        },
        {
            'type': 'Feature',
            'properties': {
                'description':
                    'Chicago',
                'icon': 'theatre',
                'tag': 'CHI'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [-87.654269, 41.8734782]
            }
        },
        {
            'type': 'Feature',
            'properties': {
                'description':
                    'Washington',
                'icon': 'theatre',
                'tag': 'WAS'
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [-77.0366307, 38.8976493]
            }
        }
    ]
}

const regionDetails = {
    "WAS": {
        "fareYears": ["2020", "2023"],
    }
}

const wasStory = `
    <b class="text-2xl">Washington, D.C.</b>

    <ul class="list-disc py-3">
        <li>Transit provides less access to opportunities for Black and Latinx residents than other residents.</li>
        <li>Transportation and development patterns create longer transit trips to healthcare and food.</li>
        <li>Expensive fares put opportunity out of reach for some riders.</li>
    </ul>

    <p class="pb-3">In the Washington metropolitan statistical area in 2021, 7% of Black workers, 6% of Latinx workers, and 3% of Asian workers - compared to 2% of white workers - took transit to work. Since the start of the COVID-19 pandemic, people of color have been far more likely than white people to continue to travel to and from work. In 2021, 29% of Black workers, 19% of Latinx workers, 40% of Asian workers, and 38% of white workers living in the Washington region worked remotely.</p>

    <p class="pb-3">Choose one of the regions from the map to zoom in and learn more, or read about <a class='text-purple-tc'
        href="/methodology">how it works</a>.</p>
    
    <p class="pb-3">We evaluated the extent to which residents of the Washington D.C. region have equitable transit access to jobs, stores, hospitals, and other important destinations. Do people with the greatest need for transit have the best access to fast, frequent, reliable, affordable service close to home? This page summarizes disparities in transit access between different groups of people, and shows how those outcomes have shifted (or not) as a result of service changes since February 2020. Evaluations are based on the combined services provided by all transit agencies in the Washington D.C. region.</p>

    <p class="pb-3">We evaluated the extent to which residents of the Washington D.C. region have equitable transit access to jobs, stores, hospitals, and other important destinations. Do people with the greatest need for transit have the best access to fast, frequent, reliable, affordable service close to home? This page summarizes disparities in transit access between different groups of people, and shows how those outcomes have shifted (or not) as a result of service changes since February 2020. Evaluations are based on the combined services provided by all transit agencies in the Washington D.C. region.</p>

    <p class="pb-3">We evaluated the extent to which residents of the Washington D.C. region have equitable transit access to jobs, stores, hospitals, and other important destinations. Do people with the greatest need for transit have the best access to fast, frequent, reliable, affordable service close to home? This page summarizes disparities in transit access between different groups of people, and shows how those outcomes have shifted (or not) as a result of service changes since February 2020. Evaluations are based on the combined services provided by all transit agencies in the Washington D.C. region.</p>
`;