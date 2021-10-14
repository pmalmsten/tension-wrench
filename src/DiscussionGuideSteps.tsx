import { Typography } from "@mui/material";
import React from "react";
import { Trait, Traits } from "./ComponentTraits";
import ProTip from "./ProTip";

export interface DiscussionGuideStep {
    label: string,
    content: JSX.Element
}

export default function generateSteps(components: string[], componentTraitsMap: Map<string, Trait[]>, dataFlows: Map<string, Set<string>>): DiscussionGuideStep[] {
    var steps = components.flatMap(component => {
        var componentTraitNamesSet = new Set(Array.from(componentTraitsMap.get(component) ?? [], (value: Trait, k: number) => value.name))

        var componentSteps: DiscussionGuideStep[] = componentTraitNamesSet.has(Traits.OutOfScope.name) ? [] : [
            {
                label: `${component}: Tampering`,
                content: <Typography>
                    An attacker might try to tamper with this component in order to accomplish their goals.
                    <p>Examples include:
                    <ul>
                        <li>An attacker might try to alter data in their database (e.g. to increase an account balance).</li>
                        <li>An attacker might try to reconfigure a load balancer in order to point route requests to a system under their control.</li>
                        <li>An attacker might try to delete or destroy a resource in order to take a system offline.</li>
                    </ul></p> 
                    <ProTip>
                        Consider using an access control mechanism to restrict acess to this resource. Some examples include operating system user
                        permissions, network access control lists, or cloud provider access mangement tools. Only grant access to users and systems
                        that need access, and grant as little access as possible.
                    </ProTip>
                    {componentTraitNamesSet.has(Traits.AzureResource.name) && <ProTip>
                        You indicated that this is an Azure resource - Azure RBAC allows one to configure fine-grained control over which users or systems
                        have the ability to administer Azure resources - 
                        consider granting the narrowest possible roles to the users and systems that need to manage this resource. In addition, some Azure 
                        resources offer additional tools for restricting access, such as VNet support, data plane role-based access control (such as for Cosmos DB), 
                        or IP address filtering.
                    </ProTip>}
                </Typography>
            },
            {
                label: `${component}: Repudiation`,
                content: <Typography>
                    An attacker might try to make an action and later claim they did not take that action, or take that action without having been discovered.
                    <p>Examples include:
                    <ul>
                        <li>An attacker might try to spend a gift card more than once.</li>
                        <li>An attacker might try to exploit a system without leaving any traces behind.</li>
                    </ul></p>
                    <ProTip>
                        Consider setting up a logging mechanism for this component, such that you can understand what transpired after the fact. There are a couple types of
                        logs that can be useful:
                        <ul>
                            <li>Application Logs. Typically unstructured logs that print diagnostic information about errors, warnings, or trace messages emitted while your application
                                is running.
                            </li>
                            <li>Request Logs. Typically a structured format that is more condensed than application logs, request logs typically record metadata about particular
                                requests your application received, and what happened - these might include the IP address of the sender, the HTTP response code that the server
                                responded with, how long the request took, etc.
                            </li>
                        </ul>
                    </ProTip>
                    {componentTraitNamesSet.has(Traits.AzureResource.name) && <ProTip>
                        You indicated that this is an Azure resource - many Azure resources offer <a href="https://docs.microsoft.com/en-us/azure/azure-monitor/essentials/platform-logs-overview">
                        built-in support for collecting diagostic logs.</a> Consider enabling diagostic logging for this resource. 
                    </ProTip>}
                </Typography>,
            },
            {
                label: `${component}: Information Disclosure`,
                content: <Typography>An attacker might try to extract data they should not have from this component.</Typography>,
            },
            {
                label: `${component}: Denial of Service`,
                content: <Typography>An attacker might try to cause this component to stop serving legitimate customers/users.</Typography>,
            },
            {
                label: `${component}: Escalation of Privilege`,
                content: <Typography>An attacker might try to take advantage of this component in order to gain access they should not have.</Typography>,
            }
        ];

        var dataFlowSteps: DiscussionGuideStep[] = Array
            .from(dataFlows.get(component)?.values() ?? [])
            .flatMap(destComponent => [
                {
                    label: `${component} <-> ${destComponent}: Spoofing of '${component}' identity`,
                    content: <Typography>An attacker might try to pretend to be '{component}' in order to gain access they should not have.</Typography>,
                },
                {
                    label: `${component} <-> ${destComponent}: Spoofing of '${destComponent}' identity`,
                    content: <Typography>An attacker might try to pretend to be '${destComponent}' in order to gain access they should not have.</Typography>,
                },
                {
                    label: `${component} <-> ${destComponent}: Tampering`,
                    content: <Typography>An attacker might try to alter information as it flows between these components (for example, as messages transit the public internet).</Typography>,
                },
                {
                    label: `${component} <-> ${destComponent}: Information Disclosure`,
                    content: <Typography>An attacker might try to spy on information as it flows between these components (for example, as messages transit the public internet).</Typography>,
                },
                {
                    label: `${component} <-> ${destComponent}: Denial of Service`,
                    content: <Typography>An attacker might try to disrupt the exchange of information between these components (for example, as messages transit the public internet).</Typography>,
                }
            ])

        return componentSteps.concat(dataFlowSteps)
    })

    return steps;
}