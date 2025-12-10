import 'server-only'
import { type ComponentFactory, DefaultComponentFactory, RichTextComponentDictionary } from '@remkoj/optimizely-cms-react/rsc'
import cmsComponents from './cms'

// Create the server factory, to be reused throughout the application
export const factory: ComponentFactory = new DefaultComponentFactory()
factory.registerAll(RichTextComponentDictionary)

// Register all CMS components AND their "Item/" prefixed versions
// This is needed because after adding Global Contract, Optimizely Graph returns 
// content types with "Item/" prefix in various positions:
// - "Page/SimplePage" becomes "Item/Page/SimplePage"  
// - "Component/TextBlock" becomes "Component/Item/Component/TextBlock"
cmsComponents.forEach(({ type, component }) => {
    // Register original type
    factory.register(type, component)

    // Also register with "Item/" prefix variations to support Global Contract
    if (Array.isArray(type)) {
        // For array types: ['Component', 'TextBlock'] -> ['Item', 'Component', 'TextBlock']
        factory.register(['Item', ...type], component)
    } else {
        // For string types, register multiple patterns:
        // 1. Simple prefix: "Page/SimplePage" -> "Item/Page/SimplePage"
        factory.register(`Item/${type}`, component)

        // 2. Middle insertion for Component types: "Component/TextBlock" -> "Component/Item/Component/TextBlock"
        const segments = type.split('/')
        if (segments.length > 1 && segments[0] === 'Component') {
            const middleInserted = `${segments[0]}/Item/${type}`
            factory.register(middleInserted, component)
        }
    }
})

/**
 * Get the cached version of the Component Factory to use, this ensure that the
 * minimum number of instances of the factory will be created.
 */
export const setupFactory = () => factory;

export default setupFactory