import "server-only";
import { createClient } from "@remkoj/optimizely-graph-client";
import { createPage } from "@remkoj/optimizely-cms-nextjs/page";
import { getContentByPath } from "@gql/functions";
import { factory } from "@components/factory";

// Create the page components and functions
const {
    generateMetadata,
    generateStaticParams,
    CmsPage: Page,
} = createPage(factory, {
    /**
     * Inject the "getContentByPath" master query that will be used to load all
     * content for the page in one request. When omitted, the default implementation
     * will revert to many requests in order to load the content.
     */
    getContentByPath: getContentByPath,

    /**
     * Extract locale from the URL path. If the first segment looks like a locale
     * code (2-letter language code, optionally with country code), use it. 
     * Otherwise default to English.
     * 
     * @param params The route parameters
     * @returns The initial locale
     */
    paramsToLocale: (params: { path?: string[] }) => {
        // If path exists and first segment looks like a locale (e.g., 'en', 'sv', 'en-US')
        if (params.path && params.path.length > 0) {
            const firstSegment = params.path[0];
            // Check if it matches locale pattern (2-letter code, optionally with -XX)
            if (/^[a-z]{2}(-[A-Z]{2})?$/i.test(firstSegment)) {
                return firstSegment;
            }
        }
        return "en";
    },

    /**
     * The factory to use to create the GraphQL Client to fetch data from Optimizely
     * CMS.
     * 
     * @returns     The Optimizely Graph Client
     */
    client: () => createClient(undefined, undefined, {
        nextJsFetchDirectives: true,
        cache: true,
        queryCache: true,
    })
});

// Configure the Next.JS route handling for the pages
export const dynamic = "error"; // Throw an error when the [[...path]] route becomes dynamic, as this will seriously hurt site performance
export const dynamicParams = true; // Allow new pages to be resolved without rebuilding the site
export const revalidate = false; // Keep the cache untill manually revalidated using the Webhook

// Export page & helper methods
export { generateMetadata, generateStaticParams };
export default Page