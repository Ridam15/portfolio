import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const range = searchParams.get('range') || '7d';

        const days = parseInt(range.replace('d', ''), 10) || 7;
        const startDate = `${days}daysAgo`;
        const propertyId = process.env.GA_PROPERTY_ID;

        if (!propertyId || !process.env.GA_CLIENT_EMAIL || !process.env.GA_PRIVATE_KEY) {
            return NextResponse.json(
                { error: 'Google Analytics credentials are not fully configured in environment variables.' },
                { status: 500 }
            );
        }

        const analyticsDataClient = new BetaAnalyticsDataClient({
            credentials: {
                client_email: process.env.GA_CLIENT_EMAIL,
                private_key: process.env.GA_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
        });

        // Request 1: Overview Metrics (Last X days vs Previous X days for percentage changes)
        const [overviewResponse] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                { startDate, endDate: 'today' }, // Current Period
                { startDate: `${days * 2}daysAgo`, endDate: `${days + 1}daysAgo` } // Previous Period
            ],
            metrics: [
                { name: 'screenPageViews' },
                { name: 'totalUsers' },
                { name: 'bounceRate' },
                { name: 'averageSessionDuration' }
            ],
        });

        // Request 2: Time Series for Chart (Daily Pageviews)
        const [timeSeriesResponse] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate, endDate: 'today' }],
            dimensions: [{ name: 'date' }],
            metrics: [{ name: 'screenPageViews' }],
            orderBys: [
                { dimension: { dimensionName: 'date' } }
            ]
        });

        // Request 3: Traffic Sources
        const [trafficResponse] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate, endDate: 'today' }],
            dimensions: [{ name: 'sessionDefaultChannelGroup' }],
            metrics: [{ name: 'totalUsers' }],
        });

        // Request 4: Device Categories
        const [deviceResponse] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate, endDate: 'today' }],
            dimensions: [{ name: 'deviceCategory' }],
            metrics: [{ name: 'totalUsers' }],
        });

        // Format Response Data safely
        const currentRes = overviewResponse.rows?.[0]?.metricValues;
        const previousRes = overviewResponse.rows?.[1]?.metricValues;

        const data = {
            overview: {
                pageViews: {
                    current: parseInt(currentRes?.[0]?.value || '0', 10),
                    previous: parseInt(previousRes?.[0]?.value || '0', 10),
                },
                users: {
                    current: parseInt(currentRes?.[1]?.value || '0', 10),
                    previous: parseInt(previousRes?.[1]?.value || '0', 10),
                },
                bounceRate: {
                    current: parseFloat(currentRes?.[2]?.value || '0') * 100, // GA returns 0.42 for 42%
                    previous: parseFloat(previousRes?.[2]?.value || '0') * 100,
                },
                avgSessionDuration: {
                    current: parseFloat(currentRes?.[3]?.value || '0'),
                    previous: parseFloat(previousRes?.[3]?.value || '0'),
                }
            },
            timeSeries: timeSeriesResponse.rows?.map(row => ({
                date: row.dimensionValues?.[0].value,
                views: parseInt(row.metricValues?.[0].value || '0', 10)
            })) || [],
            trafficSources: trafficResponse.rows?.map(row => ({
                source: row.dimensionValues?.[0].value,
                users: parseInt(row.metricValues?.[0].value || '0', 10)
            })) || [],
            devices: deviceResponse.rows?.map(row => ({
                device: row.dimensionValues?.[0].value,
                users: parseInt(row.metricValues?.[0].value || '0', 10)
            })) || []
        };

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Analytics API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch analytics data' },
            { status: 500 }
        );
    }
}
