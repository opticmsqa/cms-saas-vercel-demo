import 'server-only'
import { type ComponentFactory, DefaultComponentFactory, RichTextComponentDictionary } from '@remkoj/optimizely-cms-react/rsc'
import cmsComponents from './cms'

// Create the server factory, to be reused throughout the application
export const factory: ComponentFactory = new DefaultComponentFactory()
factory.registerAll(RichTextComponentDictionary)

// Register all CMS components AND their "Item/" prefixed versions
// This is needed because after adding Global Contract, Optimizely Graph returns 
// content types with "Item/" prefix (e.g., "Item/Page/SimplePage" instead of "Page/SimplePage")
cmsComponents.forEach(({ type, component }) => {
    // Register original type
    factory.register(type, component)

    // Also register with "Item/" prefix to support Global Contract
    const itemType = Array.isArray(type)
        ? ['Item', ...type]
        : `Item/${type}`
    factory.register(itemType, component)
})

/**
 * Get the cached version of the Component Factory to use, this ensure that the
 * minimum number of instances of the factory will be created.
 */
export const setupFactory = () => factory;

export default setupFactory