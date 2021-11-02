// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Typography } from "@mui/material";
import React from "react";
import { Trait, Traits } from "./ComponentTraits";
import ProTip from "./ProTip";
import Warning from "./Warning";

export interface DiscussionGuideStep {
    label: string,
    content: JSX.Element
}

function getNamesOfTraitsPresentForComponent(componentTraitsMap: Map<string, Trait[]>, component: string): Set<string> {
    return new Set(Array.from(componentTraitsMap.get(component) ?? [], (value: Trait, k: number) => value.name))
}

export default function generateSteps(components: string[], componentTraitsMap: Map<string, Trait[]>, dataFlows: Map<string, Set<string>>): DiscussionGuideStep[] {
    var steps = components.flatMap(component => {
        var componentTraitNamesSet = getNamesOfTraitsPresentForComponent(componentTraitsMap, component)

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
                content: <Typography>
                    An attacker might try to extract data they should not have access to from this component.
                    <p>Examples include:
                    <ul>
                        <li>An attacker gains access to the datacenter where this component is housed and walks away with the underlying physical storage.</li>
                        <li>An attacker gains access to this component by exploiting a vulnerability in the OS or other software and extracts confidential information stored on disk.</li>
                        <li>An attacker gains access to this component by exploiting incorrect access control settings and extracts confidential information from this resource.</li>
                    </ul></p>
                    <ProTip>
                        Consider using an access control mechanism to restrict acess to this resource. Some examples include operating system user
                        permissions, network access control lists, or cloud provider access mangement tools. Only grant access to users and systems
                        that need access, and grant as little access as possible.
                    </ProTip>
                    <ProTip>
                        For particularly sensitive / high-value information stored at rest, consider whether additional defenses may be appropriate. For example:
                        <ul>
                            <li>
                                When storing passwords: consider whether you can avoid storing passwords at all by using a third-party authentication provider instead 
                                (like <a href="https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-overview"> Microsoft Identity Platform</a>). If you must
                                store passwords, follow guidelines for doing so safely (like 
                                <a href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html">OWASP's Password Cheat Sheet</a>)
                            </li>
                            <li>
                                When storing other confidential information: consider encrypting the sensitive information before storing it, which would make it much more difficult
                                for an attacker to make use of any data they gain acess to. Follow guidelines like 
                                <a href="https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html">OWASP's Cryptographic Storage cheat sheet</a>, and/or regulatory
                                standards like PCI-DSS, HIPAA, or FedRAMP that might apply to your use case.
                            </li>
                        </ul>
                    </ProTip>
                    {componentTraitNamesSet.has(Traits.AzureResource.name) && <ProTip>
                        You indicated that this is an Azure resource - Many Azure resources offer tools for controlling which other systems can access access data, such as VNet support, 
                        data plane role-based access control (such as for Cosmos DB), IP address filtering, and others. Consider how you might leverage these to limit access to this
                        resource to just those users or systems who need it.
                        
                        <p>Azure offers <a href="https://docs.microsoft.com/en-us/azure/security/fundamentals/encryption-overview">a varity of tools to help you encrypt data</a>, both
                        'server side' (encryption at rest provided transparently by Azure resources for you) and 'client side' (encryption your application performs before storing
                        data).</p>
                    </ProTip>}
                </Typography>,
            },
            {
                label: `${component}: Denial of Service`,
                content: <Typography>
                    An attacker might try to cause this component to stop serving legitimate customers/users.
                    <p>Examples include:
                    <ul>
                        <li>An attacker (or even an overzelous legitimate user) might try to flood this component with more requests or network traffic than it can handle.</li>
                        <li>An attacker might try to exhaust resources provided by this component. They might:
                            <ul>
                                <li>Send requests that are very large, to consume RAM.</li>
                                <li>Send requests to your API that causes your services to download very large files (e.g. if your API takes a URL as input) to exhaust disk space.</li>
                                <li>Consume available CPU by mining for bitcoin (if your component runs code provided by users, e.g. like CI/CD tools such as Github Actions).</li>
                            </ul>
                        </li>
                    </ul></p>
                    <ProTip>
                        Consider limiting how many resources any given user of this component may consume. Some options to consider include:
                        <ul>
                            <li>Limiting how large requests to this component may be, in terms of total size (bytes), number of items (for APIs accepting lists of items), or both.</li>
                            <li>Limiting how often a given user is allowed to invoke your API and returning throttling errors (e.g. HTTP 429) when the limit is exceeded.</li>
                            <li>Use a DDoS protection service provider in front of this component in order to defend against excessive network traffic.</li>
                        </ul>
                    </ProTip>
                    {componentTraitNamesSet.has(Traits.AzureResource.name) && <ProTip>
                        You indicated that this is an Azure resource - Azure offers a varity of tools to help defend against denial of service attacks, including:
                        <ul>
                            <li><a href="https://docs.microsoft.com/en-us/azure/api-management/api-management-key-concepts">Azure API Management</a> provides 
                                configurable rules for limiting how often a given subscriber may call an API.
                            </li>
                            <li>Azure Front Door provides a <a href="https://docs.microsoft.com/en-us/azure/frontdoor/front-door-ddos">variety of DDoS protections built-in</a> that
                                can help stop floods of illegtimate network traffic before they arrive at your system.
                                <ul>
                                    <li><a href="https://docs.microsoft.com/en-us/azure/web-application-firewall/overview">Azure Web Application Firewall</a> (which can integrate 
                                    with Azure Front Door) also offers rules for rate limiting requests by client IP address.</li>
                                </ul>
                            </li>
                        </ul>
                    </ProTip>}
                </Typography>,
            },
            {
                label: `${component}: Escalation of Privilege`,
                content: <Typography>
                    An attacker might try to take advantage of this component in order to gain access they should not have.
                    <p>Examples include:
                    <ul>
                        <li>An attacker might try to trick this component into taking actions that it shouldn't (for example, an attacker might include SQL commands in API inputs
                            hoping that this component sends those commands to a database improperly).
                        </li>
                        <li>An attacker might try to exploit vulnerabilities in process running as an administrator/root in order to gain administrator access to a system.</li>
                        <li>After gaining access to a system, an attacker might try to find credentials stored on the system that grant the attacker more access (either access
                            to more systems they could not access before, or higher privilege access to systems the attacker could already access).
                        </li>
                    </ul></p>
                    <ProTip>
                        Common ways to mitigate escalation of privilege attacks include:
                        <ul>
                            <li>Taking care to keep commands separate from data, particularly for databases. For SQL, a great way to do this is through parameterized queries (
                                aka. prepared statements).
                            </li>
                            <li>Validate inputs carefully before acting on them.</li>
                            <li>When this component calls another component on behalf of a client, indicate to the downstream system who the call is being made on behalf of; this allows
                                the downstream system to determine whether the originator of the request is authorized (in addition to checking that this component is allowed to)
                                make the call. For more specific examples, see 
                                <a href="https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow">Microsoft Identity Platform</a> on-behalf-of flow and 
                                the <a href="https://docs.aws.amazon.com/IAM/latest/UserGuide/confused-deputy.html">AWS IAM external ID</a> field.
                            </li>
                            <li>Run this component with the least privilege necessary for it to function. For processes on a host, run as non-administrative system user having minimal
                                privileges; for cloud services, use roles granting as few permissions as possible.
                            </li>
                        </ul>
                    </ProTip>
                    {componentTraitNamesSet.has(Traits.AzureResource.name) && <ProTip>
                        You indicated that this is an Azure resource - as an example of how to keep commands separate from data, if this component accesses Cosmos DB using the SQL API, consider 
                        using <a href="https://docs.microsoft.com/en-us/azure/cosmos-db/sql/sql-query-parameterized-queries">CosmosDB parameterized queries.</a>
                    </ProTip>}
                </Typography>,
            }
        ];

        const createSpoofingStepContent = (spoofedComponent: string, checkingComponent: string) => {
            const spoofedComponentTraitNames = getNamesOfTraitsPresentForComponent(componentTraitsMap, spoofedComponent)
            const checkingComponentTraitNames = getNamesOfTraitsPresentForComponent(componentTraitsMap, checkingComponent)

            const spoofedComponentActsAsClient = spoofedComponentTraitNames.has(Traits.ActsAsAClient.name)
            const spoofedComponentActsAsServer = spoofedComponentTraitNames.has(Traits.ActsAsAServer.name)

            const checkingComponentActAsClient = checkingComponentTraitNames.has(Traits.ActsAsAClient.name)
            const checkingComponentActsAsServer = checkingComponentTraitNames.has(Traits.ActsAsAServer.name)

            return <Typography>
                An attacker might try to pretend to be '{spoofedComponent}' in order to gain access they should not have.
                <p>Examples include:
                <ul>
                    <li>An attacker might try to make API calls while saying they are someome they are not (e.g. by spoofing their IP address).</li>
                    <li>An attacker might try to hijack a DNS name such that it points to a system under the attackers' control.</li>
                </ul>
                </p>
                <ProTip>
                    Consider having {checkingComponent} require that {spoofedComponent} prove its identity using a strong identification mechanism
                    that is difficult to forge. For example:
                    <ul>
                        {checkingComponentActAsClient &&
                            <li>
                                You indicated that {checkingComponent} acts as a client - consider having {checkingComponent} only connect to {spoofedComponent}
                                &nbsp;using TLS and require that the server prove its identity with a valid certificate signed by a trusted CA.
                            </li>
                        }

                        {checkingComponentActsAsServer && 
                            <li>
                                You indicated that {checkingComponent} acts as a server - consider having {checkingComponent} require that
                                {spoofedComponent} prove that it knows a secret having enough entropy that it would be impractical for an attacker to guess (e.g.
                                an access token sent over TLS or a TLS client certificate).
                            </li>
                        }
                        <li>
                            If {spoofedComponent} and {checkingComponent} exchange messages outside of a server/client relationship (e.g. via a message broker, or a 
                            non-TCP channel), consider having both components require messages to be signed with a&nbsp;
                            <a href="https://en.wikipedia.org/wiki/Message_authentication_code">message authentication code</a> or&nbsp;
                            <a href="https://en.wikipedia.org/wiki/Digital_signature">digital signature</a>.
                        </li>
                    </ul>
                </ProTip>
                
                { spoofedComponentActsAsServer && spoofedComponentTraitNames.has(Traits.AzureResource.name) && 
                    <ProTip>
                        You indicated that at {spoofedComponent} is an Azure resource, and that it acts as a server - some Azure services offer the ability to manage TLS certificates 
                                for your custom domains (and their corresponding private keys) for you automatically, such as&nbsp;
                                <a href="https://docs.microsoft.com/en-us/azure/app-service/configure-ssl-certificate#create-a-free-managed-certificate">App Service</a> and&nbsp;
                                <a href="https://docs.microsoft.com/en-us/azure/frontdoor/standard-premium/how-to-configure-https-custom-domain#azure-managed-certificates">Front Door</a>.
                    </ProTip>
                }

                { spoofedComponentActsAsClient && spoofedComponentTraitNames.has(Traits.AzureResource.name) && checkingComponentTraitNames.has(Traits.AzureResource.name) &&
                    <ProTip>
                        You indicated that {spoofedComponent} acts as a client, it is an Azure resource, and that {checkingComponent} is also an Azure resource - many Azure services 
                            make it easy for your code to authenticate to other Azure resources by providing&nbsp;
                            <a href="https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview">managed identity
                            credentials</a> to your code, which {spoofedComponent} can use when connecting to {checkingComponent}.
                    </ProTip>
                }

                { spoofedComponentActsAsClient && checkingComponentTraitNames.has(Traits.AzureResource.name) &&
                    <ProTip>
                        You indicated that {spoofedComponent} acts as a client, and that {checkingComponent} is also an Azure resource - 
                            some Azure resources can also help you authenticate clients, such as&nbsp; 
                        <a href="https://docs.microsoft.com/en-us/azure/app-service/overview-authentication-authorization">App Service built-in authentication and authorization.</a>
                    </ProTip>
                }
                       
                {!(checkingComponentTraitNames.has(Traits.ActsAsAServer.name) || checkingComponentTraitNames.has(Traits.ActsAsAClient.name)) &&
                    <ProTip>
                        To get better suggestions here about how to verify {spoofedComponent}'s identity, add the '{Traits.ActsAsAServer.name}' and/or
                        '{Traits.ActsAsAClient.name}' traits to {checkingComponent} and {spoofedComponent}.
                    </ProTip>
                }
            </Typography>
        }

        var dataFlowSteps: DiscussionGuideStep[] = Array
            .from(dataFlows.get(component)?.values() ?? [])
            .flatMap(destComponent => [
                {
                    label: `${component} <-> ${destComponent}: Spoofing of '${component}' identity`,
                    content: createSpoofingStepContent(component, destComponent)
                },
                {
                    label: `${component} <-> ${destComponent}: Spoofing of '${destComponent}' identity`,
                    content: createSpoofingStepContent(destComponent, component),
                },
                {
                    label: `${component} <-> ${destComponent}: Tampering`,
                    content: <Typography>
                        An attacker might try to alter information as it flows between these components (for example, as messages transit the public internet).
                        <p>Examples include:
                            <ul>
                                <li>An attacker might try to alter the content of a web site as it flows over a network in order to censor speech.</li>
                                <li>An attacker might try to alter the content of a web site as it flows over a network in order to insert malware (like a bitcoin miner).</li>
                                <li>An attacker might try to alter the content of a library binary as it flows over a network in order to insert malware (like a reverse shell).</li>
                            </ul>
                        </p>
                        <ProTip>
                            Consider having {component} and {destComponent} use a security control that assures the integrity of messages that they exchange such that
                            any attempt at tampering may be detected. Examples include:
                            <ul>
                                <li>For TCP connections, TLS is a good way to protect the integrity &amp; authenticity of messages that are exchanged</li>
                                <li>For UDP messages, dTLS is a good way to integrity &amp; authenticity of messages that are exchanged in a similar manner as TLS.</li>
                                <li>
                                    If these components exchange messages outside of a server/client relationship (e.g. via a message broker, or a 
                                    non-TCP channel), consider having both components require messages to be signed with a&nbsp;
                                    <a href="https://en.wikipedia.org/wiki/Message_authentication_code">message authentication code</a> or&nbsp;
                                    <a href="https://en.wikipedia.org/wiki/Digital_signature">digital signature</a>.
                                </li>
                            </ul>
                        </ProTip>
                        <Warning>
                            When checking the integrity of messages exchanged over an untrusted channel, make sure that the expected digest value either comes from a trusted source 
                            over a separate trusted channel or is authenticated using a strong authentication mechanism. 
                            
                            <p>
                                For example, if a message and a SHA256 digest of the message's content were sent together over an untrusted channel, and attacker could easily 
                                recompute the correct SHA256 to send alongside an altered copy of a message, and the receiver would not be able to detect that the message was altered.
                                Much better approaches would be to attach a <a href="https://en.wikipedia.org/wiki/Message_authentication_code">message authentication code</a> or&nbsp;
                                <a href="https://en.wikipedia.org/wiki/Digital_signature">digital signature</a> to the message instead (either of which are much more difficult
                                for an attacker to forge), or to send the expected SHA256 digest over a separate, trusted channel (e.g. over a separate connection protected with TLS).
                            </p>
                        </Warning>
                    </Typography>,
                },
                {
                    label: `${component} <-> ${destComponent}: Information Disclosure`,
                    content: <Typography>
                        An attacker might try to spy on information as it flows between these components (for example, as messages transit the public internet).
                        <p>For example:
                            <ul>
                                <li>An attacker might try to read the contents of network packets flowing through a router that they previously compromised.</li>
                                <li>An attacker might try to read the contents of environment variables passed from one process to another.</li>
                                <li>An attacker might try to read the contents data sent over a pipe from one process to another.</li>
                                <li>An attacker might try to attach a bus sniffer to a hardware bus connecting multiple integrated circuits on a circuit board to extract 
                                    confidential keys or secrets sent between them.</li>
                            </ul>
                        </p>
                        <ProTip>
                            Consider having {component} and {destComponent} protect the contents of messages exchanged between them using a security control that provides
                            confidentiality (e.g. encryption). For example:
                            <ul>
                                <li>When using TCP, TLS provides confidentiality through encryption. See 
                                    <a href="https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html">OWASP's Transport Layer Protection cheat sheet</a> for specific
                                    guidance.
                                </li>
                                <li>When using UDP, dTLS provides confidentiality through encryption similar to that of TLS.</li>
                            </ul>
                        </ProTip>
                        <Warning>
                            When establishing encryption keys with a remote system, be mindful of how certain you are that you established an encrypted connection with
                            a system that you trust. For example, even when using TLS to encrypt messages sent over a network, if the remote system is not properly authenticated first by verifying the
                            certificate they present, then an attacker can simply spoof the identity of the remote system in order to trick the client into sharing encryption keys with
                            them.
                        </Warning>
                    </Typography>,
                },
                {
                    label: `${component} <-> ${destComponent}: Denial of Service`,
                    content: <Typography>
                        An attacker might try to disrupt the exchange of information between these components (for example, as messages transit the public internet).
                        <p>For example:
                            <ul>
                                <li>An attacker might try to send large volumes of data over a network in order to delay legitimate messages from getting through.</li>
                                <li>An attacker (or even someone making a mistake) might try to disconnect a network route between two components in order to prevent them from
                                    exchanging information.
                                </li>
                            </ul>
                        </p>
                        <ProTip>
                            Typical strategies for defending against excessive network traffic saturating a data link include placing high capacity traffic filters in front 
                            of finite capacity data links in order to drop illegtimate packets before they consume capacity of the backbone link. DDoS protection services (such as Microsft, CloudFlare, AWS, etc.)
                            typically place many such traffic filters around the globe and use DNS to route clients to the nearest one in order to defend their networks.

                            <p>Consider what would happen in the event of an accidental network disruption between these components - would these components be able to fail over
                                to a separate redundant network link? Would these components be able to fail over to separate redundant instances (e.g. database failover)? Is your
                                application designed such that network errors would be detected and traffic shifted to healthy instances (e.g. within a data center via a
                                load balancer, or cross-region via a global router like DNS)?</p>
                        </ProTip>
                    </Typography>,
                }
            ])

        return componentSteps.concat(dataFlowSteps)
    })

    return steps;
}