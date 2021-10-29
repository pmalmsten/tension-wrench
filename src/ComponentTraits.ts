
export interface Trait {
    name: string, 
    description: string
}

export const Traits: { [key: string]: Trait } = {
    OutOfScope: {
        name: 'Out of Scope',
        description: 'Our system interacts with this component, but we are not responsible for securing it.'
    },
    AzureResource: {
        name: 'Azure Resource',
        description: 'This component is an Azure Resource itself (e.g. a CosmosDB database) or is built on one (e.g. an API built on App Service).'
    },
    MyCodeRunsHere: {
        name: 'My Code Runs Here',
        description: 'Code you or your team wrote runs on this resource.'
    },
    ActsAsAClient: {
        name: 'Acts as a CLient',
        description: 'This component connects to other components'
    },
    ActsAsAServer: {
        name: 'Acts as a Server',
        description: 'Other components connect to this component'
    }
};

export const AllTraits: Trait[] = Object.values(Traits);