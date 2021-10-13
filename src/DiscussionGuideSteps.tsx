import React from "react";
import { Trait, Traits } from "./ComponentTraits";

export interface DiscussionGuideStep {
    label: string,
    description: string,
    suggestions: JSX.Element[]
}

export default function generateSteps(components: string[], componentTraitsMap: Map<string, Trait[]>, dataFlows: Map<string, Set<string>>): DiscussionGuideStep[] {
    var steps = components.flatMap(component => {
        var componentTraitNamesSet = new Set(Array.from(componentTraitsMap.get(component) ?? [], (value: Trait, k: number) => value.name))

        var componentSteps: DiscussionGuideStep[] = componentTraitNamesSet.has(Traits.OutOfScope.name) ? [] : [
            {
                label: `${component}: Tampering`,
                description: "An attacker might try to tamper with this component.",
                suggestions: [
                    <React.Fragment>
                        Consider using an access control mechanism to restrict acess to this resource. Some examples include operating system user
                        permissions, network access control lists, or cloud provider access mangement tools. Only grant access to users and systems
                        that need access, and grant as little access as possible.
                    </React.Fragment>,
                    componentTraitNamesSet.has(Traits.AzureResource.name) ? <React.Fragment>
                        You indicated that this is an Azure resource - Azure RBAC allows one to configure fine-grained control over which users or systems
                        have the ability to administer Azure resources - 
                        consider granting the narrowest possible roles to the users and systems that need to manage this resource. In addition, some Azure 
                        resources offer additional tools for restricting access, such as VNet support, data plane role-based access control (such as for Cosmos DB), 
                        or IP address filtering.
                    </React.Fragment> : undefined
                ].flatMap(x => x ?? [])
            },
            {
                label: `${component}: Repudiation`,
                description: "An attacker might try to make an action and later claim they did not take that action, or take that action without having been discovered.",
                suggestions: []
            },
            {
                label: `${component}: Information Disclosure`,
                description: "An attacker might try to extract data they should not have from this component.",
                suggestions: []
            },
            {
                label: `${component}: Denial of Service`,
                description: "An attacker might try to cause this component to stop serving legitimate customers/users.",
                suggestions: []
            },
            {
                label: `${component}: Escalation of Privilege`,
                description: "An attacker might try to take advantage of this component in order to gain access they should not have.",
                suggestions: []
            }
        ];

        var dataFlowSteps: DiscussionGuideStep[] = Array
            .from(dataFlows.get(component)?.values() ?? [])
            .flatMap(destComponent => [
                {
                    label: `${component} <-> ${destComponent}: Spoofing of '${component}' identity`,
                    description: `An attacker might try to pretend to be '${component}' in order to gain access they should not have.`,
                    suggestions: []
                },
                {
                    label: `${component} <-> ${destComponent}: Spoofing of '${destComponent}' identity`,
                    description: `An attacker might try to pretend to be '${destComponent}' in order to gain access they should not have.`,
                    suggestions: []
                },
                {
                    label: `${component} <-> ${destComponent}: Tampering`,
                    description: `An attacker might try to alter information as it flows between these components (for example, as messages transit the public internet).`,
                    suggestions: []
                },
                {
                    label: `${component} <-> ${destComponent}: Information Disclosure`,
                    description: `An attacker might try to spy on information as it flows between these components (for example, as messages transit the public internet).`,
                    suggestions: []
                },
                {
                    label: `${component} <-> ${destComponent}: Denial of Service`,
                    description: `An attacker might try to disrupt the exchange of information between these components (for example, as messages transit the public internet).`,
                    suggestions: []
                }
            ])

        return componentSteps.concat(dataFlowSteps)
    })

    return steps;
}