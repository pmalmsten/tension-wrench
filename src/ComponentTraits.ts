
export interface Trait {
    name: string, 
    description: string
}

export const Traits = {
    OutOfScope: {
        name: 'Out of Scope',
        description: 'My system interacts with this component, but we are not responsible for securing it.'
    },
    AzureResource: {
        name: 'Azure Resource',
        description: 'This component either is an Azure Resource (e.g. a CosmosDB database) or is built on one (e.g. App Service).'
    },
    MyCodeRunsHere: {
        name: 'My Code Runs Here',
        description: 'Code we wrote runs on this resource.'
    }
};

export const AllTraits: Trait[] = Object.values(Traits);