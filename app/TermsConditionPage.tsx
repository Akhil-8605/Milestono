import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const TermsCondition: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>TERMS AND CONDITIONS</Text>
                    <Text style={styles.lastUpdated}>Last updated December 26, 2024</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Introduction</Text>
                    <Text style={styles.text}>
                        This website milestono.com , including any subdomains thereof, and
                        any other websites through which its services are made available,
                        our mobile, tablet and other smart device applications, and
                        application program interfaces etc, , (hereinafter collectively
                        referred to as "milestono") is owned, hosted and operated
                        (hereinafter referred to as P.I.N PVT.Limited), a company
                        incorporated in India under the Companies Act, 1956 and having its
                        registered office at Ground Floor, GF-12A, 94, Meghdoot, Nehru
                        Place, New Delhi - 110 020. These terms and conditions, privacy
                        policy and community guidelines regulating use of these Services
                        constitute a legally binding agreement between milestono and the
                        User (the "Agreement").{'\n\n'}
                        milestono and/or any other website(s) linked to this website is an
                        online information and communications service provided to you,
                        subject to your compliance with the terms and conditions set forth
                        below.{'\n\n'}
                        P.I.N PVT.Limited may amend/modify these terms and conditions at any
                        time, and such modifications shall be effective immediately upon
                        posting of the modified terms and conditions on milestono. You may
                        review the modified terms and conditions periodically to be aware of
                        such modifications and your continued access or use of milestono,
                        shall be deemed conclusive proof of your acceptance of these terms
                        and conditions, as amended/modified from time to time. P.I.N
                        PVT.Limited may also suspend the operation of milestono for support
                        or technical upgradation, maintenance work, in order to update the
                        content or for any other reason.{'\n\n'}
                        If you utilize milestono in a manner inconsistent with these terms
                        and conditions, P.I.N PVT.Limited may terminate your access, block
                        your future access and/or seek such additional relief as the
                        circumstances of your misuse may be deemed to be fit and proper.
                    </Text>
                </View>

                <View style={[styles.section, styles.tableOfContentsSection]}>
                    <TouchableOpacity
                        style={[styles.dropdownHeader, isOpen && styles.dropdownHeaderOpen]}
                        onPress={toggleDropdown}
                    >
                        <Text style={styles.tableOfContentsTitle}>
                            Contents {isOpen ? '▲' : '▼'}
                        </Text>
                    </TouchableOpacity>
                    {isOpen && (
                        <View style={styles.tableOfContents}>
                            <Text style={styles.tocItem}>1. Definitions</Text>
                            <Text style={styles.tocItem}>2. Submission and administration of listings/advertisements</Text>
                            <Text style={styles.tocItem}>3. CPL Marketing Campaigns with Developers and Agents/Brokers</Text>
                            <Text style={styles.tocItem}>4. Video Community Guidelines</Text>
                            <Text style={styles.tocItem}>5. Use of information</Text>
                            <Text style={styles.tocItem}>6. Intellectual property rights</Text>
                            <Text style={styles.tocItem}>7. Restriction/ Prohibitions</Text>
                            <Text style={styles.tocItem}>8. Links to third party web sites</Text>
                            <Text style={styles.tocItem}>9. Disclaimer and warranties</Text>
                            <Text style={styles.tocItem}>10. Limitation of liability</Text>
                            <Text style={styles.tocItem}>11. Termination</Text>
                            <Text style={styles.tocItem}>12. Indemnification</Text>
                            <Text style={styles.tocItem}>13. Privacy policy</Text>
                            <Text style={styles.tocItem}>14. Arbitration</Text>
                            <Text style={styles.tocItem}>15. Severability of provisions</Text>
                            <Text style={styles.tocItem}>16. Waiver</Text>
                            <Text style={styles.tocItem}>17. Governing law</Text>
                            <Text style={styles.tocItem}>18. Jurisdiction</Text>
                            <Text style={styles.tocItem}>19. Grievances</Text>
                            <Text style={styles.tocItem}>20. Amendment</Text>
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Definition</Text>
                    <Text style={styles.text}>
                        The term Subscriber/User would include any person, whether an
                        individual or a legal entity who has subscribed to the Services of
                        milestono (whether on a paid or free basis), and to whom the access
                        to milestono is restricted by the use of a sign in user name and a
                        password. The user name and password are either allotted by
                        milestono or chosen by the Subscriber or agreed upon by milestono.
                        It is made abundantly clear that only the authorized User has the
                        right to access the Services so offered by milestono.{'\n\n'}
                        The term Browser/Visitor will mean and include a person who utilizes
                        any of the Services offered by milestono, without the need or a
                        requirement to create an account i.e. visits non-restricted portions
                        of milestono.The term Advertiser would include a Subscriber/User
                        uploading or relaying content using the Services.{'\n\n'}
                        The use and access to milestono shall be subject to these terms and
                        conditions and community guidelines. For the purposes of this
                        Agreement, any person who does not have a legal or a contractual
                        right to access the Services, but does so, will fall within the
                        definition of an 'unauthorized user' and will
                        nevertheless be subject to the terms and conditions regulating the
                        usage of milestono, and expressly so with respect to respecting the
                        intellectual property rights of the P.I.N PVT.Limited, and abiding
                        by terms and conditions below mentioned.{'\n\n'}
                        The terms 'User' and 'Customer' would
                        include both the Subscriber/Advertiser(s) and Browser/Visitor(s).
                        {'\n\n'}
                        The terms 'Service' or 'Services' would mean
                        to include the interactive online information service offered by
                        milestono on the internet through which the user may access
                        information carried by milestono in the database maintained by it.
                        The terms would also include to mean the search tools through which
                        the User can search through the hosted databases and information
                        using a number of search tools that are present with a selection
                        matching their search criteria. The term would also include services
                        by way of space used by customers for advertisements such as
                        listings and banners. Users then select one or more of the items
                        presented to view the full document/ record. The term Service does
                        not extend to milestono acting as an agent either express or implied
                        on behalf of any User/Customer and is merely acting as a medium of
                        information exchange.{'\n\n'}
                        The term RERDA shall mean and include the Real Estate (Regulation
                        and Development) Act, 2016
                        (http://mhupa.gov.in/User_Panel/UserView.aspx?TypeID=1535) as
                        amended read with any rules or regulations that might be framed
                        thereunder.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Submission and administration of listings/advertisements</Text>
                    <Text style={styles.text}>
                        User agrees not to submit any property descriptions, photographs,
                        financial, contact or other information contained in each
                        property's data to milestono unless the User submitting such a
                        Listing/Advertisement has acquired and received all necessary rights
                        and authorizations from the owner of such property or the
                        power-of-attorney holder, including from the photographer and/or
                        copyright owner of any photographs, to publish and advertise the
                        said Property(s) on the User's website or on milestono.
                        Similarly, milestono does not take any ownership, directly or
                        indirectly towards any person whatsoever, with respect to banners
                        hosted on its website by its customers, which are strictly in the
                        nature of sale of space by 99acre & it has not carried out any
                        independent verification on the authenticity or compliance
                        requirements, as may have been required under any law for the time
                        being in force, of such images/ banners/ listings.{'\n\n'}
                        <Text style={styles.bold}>Payment Terms</Text>{'\n\n'}
                        Payments for the Services offered by milestono shall be on a 100%
                        advance basis. The payment for Service once subscribed to by the
                        subscriber is not refundable and any amount paid shall stand
                        appropriated. Refund if any will be at the sole discretion of Info
                        Edge (India) Limited. P.I.N PVT.Limited offers no guarantees
                        whatsoever for the accuracy or timeliness of the refunds reaching
                        the Users card/bank accounts.{'\n\n'}
                        <Text style={styles.bold}>Refund in failed transactions</Text>{'\n\n'}
                        Though P.I.N PVT.Limited payment reconciliation team works on a 24 x
                        7 basis, P.I.N PVT.Limited offers no guarantees whatsoever for the
                        accuracy or timeliness of the refunds reaching the Subscribers
                        card/bank accounts. This is on account of the multiplicity of
                        organizations involved in processing of online transactions, the
                        problems with Internet infrastructure currently available and
                        working days/holidays of financial institutions. Refunds in the
                        event of wrong/objectionable property content being posted on the
                        site would be at the discretion of milestono.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. CPL Marketing Campaigns with Developers and Agents/Brokers</Text>
                    <Text style={styles.text}>
                        1. In case of CPL marketing campaigns, P.I.N PVT.Limited shall
                        endeavor to deliver agreed number of leads at agreed cost per lead.
                        {'\n'}
                        2. In case of CPL marketing campaigns P.I.N PVT.Limited reserves
                        right, in its sole discretion, to decide and deploy the
                        channel/product for advertising to generate leads.{'\n'}
                        3. P.I.N PVT.Limited reserves right at its sole discretion, to stop
                        any campaign on either completion of its obligation for leads
                        delivery or upon non receipt of amount as stipulated under agreed
                        terms.{'\n'}
                        4. P.I.N PVT.Limited neither guarantees nor participates in nor is
                        privy to potential conversion of delivered leads or any possible
                        transactions as a consequence thereof in any manner whatsoever.
                        P.I.N PVT.Limited is an intermediary under the provisions of IT act
                        2000. A lead is contact details of a user who has consented to be
                        contacted about P.I.N PVT.Limited advertised properties or projects
                        or other similar properties.{'\n'}
                        5. Any advance or amount received against such invoice is
                        non-refundable.{'\n'}
                        6. The customer agrees to strictly adhere to applicable data privacy
                        law with respect to the leads delivered by P.I.N PVT.Limited.
                        {'\n'}
                        7. P.I.N PVT.Limited shall not be liable for any loss, direct or
                        indirect, to anyone on account of any reason whatsoever.{'\n'}
                        8. If the same lead(s) is generated for the same project within 30
                        days of the 1st unique lead generation date, P.I.N PVT.Limited will
                        consider the recurring lead(s) as duplicate and not charge the
                        duplicate count. In all other scenarios, lead will be considered as
                        unique.{'\n'}
                        9. The customer shall be responsible for the protection of personal
                        data contained in all leads, as per applicable law, and it
                        understands that the limited consent obtained by P.I.N PVT.Limited
                        is for the purposes of enabling it to share the lead with the
                        Customer.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. USER REGISTRATION</Text>
                    <Text style={styles.text}>
                        User agrees to comply with the following community guidelines while
                        submitting video content for listings/advertisements:{'\n\n'}
                        • Video should be original, free from any copyright issue
                        {'\n'}• Video should not contain any personally identifiable
                        information of the User/Agency{'\n'}
                        • Video content should not be obscene/inappropriate{'\n'}
                        • Video should not contain language which is detrimental to any community/segment{'\n\n'}
                        <Text style={styles.bold}>Video Content Screening</Text>{'\n\n'}
                        Videos shared by user shall go through multiple stages of screening
                        (human and technology driven) before going live on the platform. In
                        case of violations with the community guidelines, the video content
                        shall be duly removed from the listing.{'\n\n'}
                        Additionally, the video screening process shall also be carried out
                        in the following cases:{'\n'}
                        • User reporting the video to toll free/email ids{'\n'}
                        • Infringement claim by agent/user{'\n'}
                        The video shall be removed from the platform in case the claim is
                        found to be correct. Final discretion on video screening and removal
                        shall always lie with Platform.{'\n\n'}
                        Agents shall have the option to edit or remove videos during the
                        course of the listing duration.{'\n\n'}
                        milestono shall utilize 3rd party services such as You-tube for
                        hosting and streaming these videos. While doing so, the site and the
                        users on the site shall be compliant with respect to You-tube Terms
                        of Service https://www.youtube.com/t/terms and Youtube API Services
                        - Developer Policies.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5. Use of Information</Text>
                    <Text style={styles.text}>
                        User agrees to treat all information obtained from the Service,
                        including listings, member directory, and any information otherwise
                        made available to User in the Service ("Content") as
                        proprietary to milestono. User agrees that Content reserved for
                        members will be maintained as confidential and shall be protected as
                        a trade secret of milestono. milestono does not ensure the accuracy
                        of, endorse or recommend any Content and a User uses such Content at
                        the User's own risk. A User may access the
                        listings/advertisements in the Service solely to obtain initial
                        information from which further evaluation and investigation may
                        commence. User shall limit access to and use of listings to personal
                        and internal use, and shall not use listings obtained from the
                        Service for further distribution, publication, public display, or
                        preparation of derivative works or facilitate any of these
                        activities in any way.{'\n\n'}
                        User shall not use or reproduce any Content that is obtained from
                        the Service, or that is otherwise made available to User in the
                        Service, for or in connection with any other listing/advertising
                        Service or device. User further shall not use the Service provided
                        by the company in any other manner for or in connection with any
                        other listing Service or device. Users violating these specific
                        terms, specifically those Users searching the Service in an abusive
                        or excessive manner, by automated or manual means, shall be subject
                        to immediate termination of their membership without notice.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>6. Intellectual property rights</Text>
                    <Text style={styles.text}>
                        All logos, brands, trade marks and Service marks ("Marks")
                        appearing in milestono are the properties either owned or used under
                        license by P.I.N PVT.Limited and / or its associates. All rights
                        accruing from the same, statutory or otherwise, wholly vest with
                        P.I.N PVT.Limited / its associates. The access to milestono does not
                        confer upon the User any license or right to use in respect of these
                        Marks and therefore the use of these Marks in any form or manner,
                        whatsoever is strictly prohibited. Any violation of the above would
                        constitute an offence under the prevailing laws of India.{'\n\n'}
                        P.I.N PVT.Limited respects the Intellectual Property Rights of all,
                        it has and will continue to adhere to all the laws applicable in
                        India in this respect. P.I.N PVT.Limited shall protect and respect
                        the Intellectual Property Rights of the users as well as third
                        parties to the best of its ability. In a case where a User(s) are
                        found to be using milestono as a platform to infringe the
                        Intellectual Property Rights of others, P.I.N PVT.Limited will be
                        free to terminate this Agreement forthwith without any notice to the
                        user.{'\n\n'}
                        By allowing Users to access milestono, P.I.N PVT.Limited grants the
                        Users a limited, non-exclusive, non-assignable, revocable license
                        (the "License") to access and use the Services, provided
                        that the User is in compliance with the terms and conditions of the
                        Agreement.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>7. Restrictions/Prohibitions</Text>
                    <Text style={styles.text}>
                        1. The following actions will inter alia constitute a misuse of
                        milestono and are strictly prohibited:{'\n\n'}
                        a. Utilising the Services offered by milestono in any manner so as
                        to impair the interests and functioning of P.I.N
                        PVT.Limited/milestono and which is non-compliant with laws and
                        regulations including RERDA.{'\n\n'}
                        b. Copying, extracting, downloading, sharing, modifying, selling,
                        storing, distributing, making derivate works from or otherwise
                        exploiting any content, data, information, including profiles,
                        personal details, photographs and/or graphics, available on
                        milestono and/or any services or products of the P.I.N PVT.Limited,
                        in any manner or for any purpose which is not, consistent with in
                        accordance with the Terms of Use.{'\n\n'}
                        Users are expressly prohibited from using or exploiting milestono
                        and/or any content or data provided therein for:{'\n\n'}
                        • Any commercial purposes such as creating alternate
                        databases, extending access to milestono to third parties without
                        prior written consent of the P.I.N PVT.Limited; and/or{'\n'}
                        • Undertaking any business activity which is in competition with the
                        business of P.I.N PVT.Limited; and/or{'\n'}
                        • Sharing access with persons who are not contracted with the P.I.N PVT.Limited.{'\n'}
                        • Reselling the products/services offered by the P.I.N PVT.Limited.
                        {'\n\n'}
                        c. Using or attempting to use any automated program, software or
                        system or any similar or equivalent process (including spiders,
                        robots, crawlers etc.) to access, navigate, search, copy, monitor,
                        download, scrape, crawl or otherwise extract in any manner, any data
                        or content including but not limited to adding or downloading
                        profiles, contact details, or send or redirect messages from
                        milestono;{'\n\n'}
                        d. Gaining or attempting to gain unauthorized access (inter alia by
                        hacking, password "mining" or any other means) to: (a) any portion
                        or feature of milestono or any of the services or products offered
                        on or through milestono which are not intended for you; (b) any
                        server, website, program or computer systems of the P.I.N
                        PVT.Limited or any other third parties and/or Users;{'\n\n'}
                        Violations of system or network security may result in civil or
                        criminal liability.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>8. Links to third party web sites</Text>
                    <Text style={styles.text}>
                        milestono may provide links to other third-party World Wide Web
                        sites or resources. P.I.N PVT.Limited makes no representations
                        whatsoever about any other Web site you may access through
                        milestono.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>9. Disclaimer and warranties</Text>
                    <Text style={styles.text}>
                        milestono is an intermediary as defined under sub-clause (w) of
                        Section 2 of the{'\n'}
                        Information Technology Act, 2000.{'\n\n'}
                        THE CONTENT OF milestono IS PROVIDED "AS IS" AND ON AN
                        "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OR
                        REPRESENTATIONS OF ANY KIND, EITHER EXPRESS OR IMPLIED.{'\n\n'}
                        P.I.N PVT.Limited and third party providing materials, services or
                        content to this website, disclaims all warranties, express or
                        implied, statutory or otherwise icluding, but not limited to,
                        implied warranties of merchantability, fitness for a partiular
                        purpose, non-infringement of third party rights, completeness or
                        accuracy of the information, update or correctness of the
                        information, freedom from computer viruses, other violation of
                        rights regarding services, products, material and contents of
                        milestono.{'\n\n'}
                        Views expressed by the Users are their own, P.I.N PVT.Limited does
                        not endorse the same and shall not be responsible for them. No claim
                        as to the accuracy and correctness of the information on the site is
                        made although every attempt is made to ensure that the content is
                        not misleading/ offensive/ inappropriate. In case any inaccuracy is
                        or otherwise improper content is sighted on the website, please
                        report it to report abuse.{'\n\n'}
                        It is solely your responsibility to evaluate the accuracy,
                        completeness and usefulness of all opinions, advice, Services, real
                        estate and other related information listed on the website. P.I.N
                        PVT.Limited does not warrant that the access to website will be
                        uninterrupted or error-free or that defects in website will be
                        corrected.{'\n\n'}
                        P.I.N PVT.Limited offers no guarantee no warrantees that there would
                        be satisfactory response or any response at all, once the
                        listing/banner is put on display. Any payments made to P.I.N
                        PVT.Limited/milestono are solely for the purposes of display of the
                        property advertised.{'\n'}
                        Users are strongly advised to independently verify the authenticity
                        of any Pre-Launch offers received by them. P.I.N PVT.Limited does
                        not endorse investment in any projects which have not received
                        official sanction and have not been launched by the
                        Builder/Promoter, users dealing in such projects shall be doing so
                        entirely at their risk and responsibility.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>10. Limitation of liability</Text>
                    <Text style={styles.text}>
                        P.I.N PVT.Limited will not be liable for any damages of any kind
                        arising out of or relating to the use or the inability to use
                        milestono, its content or links, including but not limited to
                        damages caused by or related to errors, omissions, interruptions,
                        defects, delay in operation or transmission, computer virus, line
                        failure and all other direct, indirect, special, incidental,
                        punitive, loss of profit, exemplary or consequential damages whether
                        based on warranty, contract, tort or any other legal theory
                        including Force Majeure, and whether or not, such organizations or
                        entities were intimated or advised of the possibility of such
                        damages.{'\n\n'}
                        P.I.N PVT.Limited assumes no responsibility for any error, omission,
                        interruption, deletion, defect, delay in operation or transmission,
                        communication line failure, theft or destruction or unauthorized
                        access to or alteration of User's data/information. P.I.N
                        PVT.Limited shall not be responsible for any problem or technical
                        malfunction on-line-systems, servers or providers, computer
                        equipment, software, failure of e-mail or players on account of
                        technical problem or traffic congestion on the Internet or at any
                        website or combination thereof, including injury or damage to any
                        User and/or Members or to any other person's computer related
                        to or resulting from participating or downloading
                        materials/information from the website.{'\n\n'}
                        For the purposes of the Consumer Protection Act, 2019 (CPA), the
                        term Consumer will be limited to paid Customers who have not
                        subscribed to milestono for purposes of commercial gain (business
                        purposes) and their intent to utilize the services for individual
                        use only.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>11. Termination</Text>
                    <Text style={styles.text}>
                        P.I.N PVT.Limited may, without notice in its sole discretion, and at
                        any time, terminate or restrict your use or access to milestono (or
                        any part thereof) for any reason, including, without limitation,
                        that P.I.N PVT.Limited based on its judgement and perception
                        believes you have violated or acted inconsistently with the letter
                        or spirit of these terms and conditions or any applicable law.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>12. Indemnification</Text>
                    <Text style={styles.text}>
                        Submissions and unauthorized use of any information(s)/materials
                        contained on milestono may violate copyright laws, trademark laws,
                        the laws of privacy and publicity, certain communications statutes
                        and regulations thereto and other applicable laws, statutes and its
                        rules and regulations. You alone are responsible for your actions or
                        the actions of any person using your user name and/or password.
                        {'\n\n'}
                        You agree to defend, indemnify, and hold harmless, P.I.N PVT.Limited
                        and/ or its associates, subsidiaries, their officers, directors,
                        employees, affiliates, licensees, business partners and agents, from
                        and against any claims, actions or demands, including without
                        limitation reasonable legal and accounting fees, alleging or
                        resulting from your use of milestono material or your breach of
                        these terms and conditions or any applicable law.{'\n\n'}
                        P.I.N PVT.Limited will not be party to any legal proceedings between
                        parties contracted through these Services. In case P.I.N PVT.Limited
                        is sought to implicated in any legal proceedings, costs will be
                        recovered from the party that names P.I.N PVT.Limited as a party to
                        such proceedings. P.I.N PVT.Limited shall abide with any court order
                        served on it through due process.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>13. Privacy Policy</Text>
                    <Text style={styles.text}>
                        The Privacy Policy of the Platform explains how we may use your
                        personal data, we will at all times respect and ensure adherence to
                        the privacy policy, additionally various settings are provided to
                        help you to be able to control the manner in which others may be
                        able to view your information as chosen by you to be displayed on
                        your profile and the manner in which you may have chosen to be
                        contacted. Any feedback provided by a User shall be deemed as
                        non-confidential to the user.{'\n\n'}
                        <Text style={styles.bold}>Terms of use for Users</Text>
                        {'\n\n'}
                        • When you indicate your interest in a Real Estate Listing
                        or express interest in related services on milestono, you authorize
                        milestono to contact you (even though you may have registered with
                        NDNC/DNC), and are sending your profile consisting of your personal
                        details and application information including relevant documents to
                        milestono, and you are requesting and authorizing milestono to make
                        available such information contained in your response to the
                        applicable Advertiser/seller(s) for such Real Estate Listing(s). You
                        provide consent for your data to be provided to such
                        Advertisers/service providers and others , who may further contact
                        you over the phone/email/whatsapp etc. Please note that our privacy
                        policy does not govern the use of your data by third parties once it
                        is shared.{'\n\n'}
                        • In addition, by using milestono, you agree that milestono
                        is not responsible for the content of the
                        Advertiser/seller's/broker's/builder's application form, messages,
                        screener questions, testing assessments; required documents, or
                        their format or method of delivery.{'\n\n'}
                        • You consent to your application, documents and any
                        responses sent to you by the Advertiser/seller or vice versa through
                        milestono being processed and analyzed by milestono according to
                        these terms of use and milestono's Privacy Policy. milestono shall
                        store and process such information regardless of whether a Real
                        Estate that had been advertised earlier continues to remain
                        available or not. milestono may use your application materials
                        (including public profile consisting of your personal details and
                        responses to advertiser/seller's questions) to determine whether you
                        may be interested in a Real Estate Listing, and milestono may reach
                        out to you about such Real Estate Listing (even though you may have
                        registered with NDNC).
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>14. Arbitration</Text>
                    <Text style={styles.text}>
                        If any dispute arises between a user/users and P.I.N PVT.Limited
                        arising out of use of the website or thereafter, in connection with
                        the validity, interpretation, implementation or alleged breach of
                        any provision of these terms and conditions, the dispute shall be
                        referred to a sole Arbitrator who shall be an independent and
                        neutral third party. Decision of the Arbitrator shall be final and
                        binding on both the parties to the dispute. The place of arbitration
                        shall be Delhi. The Arbitration & Conciliation Act, 1996, shall
                        govern the arbitration proceedings.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>15. Severability of provisions</Text>
                    <Text style={styles.text}>
                        THIS AGREEMENT between you and P.I.N PVT.Limited governs your use of
                        milestono. If any provision of these milestono terms and conditions
                        or part thereof is inconsistent with or is held to be invalid/void
                        by or under any law, rule, order or regulation of any Government or
                        by the final adjudication of any court, such inconsistency or
                        invalidity shall not affect the enforceability of any other
                        provision of the terms and conditions.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>16. Waiver</Text>
                    <Text style={styles.text}>
                        The failure of P.I.N PVT.Limited to exercise or enforce any right or
                        provision of the terms and conditions of use shall not constitute a
                        waiver of its right to enforce such right or provision subsequently.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>17. Governing law</Text>
                    <Text style={styles.text}>
                        By accessing milestono you agree that the laws prevailing in India
                        shall be the governing laws in all matters relating to milestono as
                        well as these terms and conditions.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>18. Jurisdiction</Text>
                    <Text style={styles.text}>
                        Courts at New Delhi, India alone shall have the exclusive
                        jurisdiction in all matters relating to milestono and these terms
                        and conditions, irrespective of the territory and jurisdiction of
                        your access to milestono.{'\n\n'}
                        P.I.N PVT.Limited does not routinely monitor your postings to the
                        web site but reserves the right to do so. However, if P.I.N
                        PVT.Limited becomes aware of an inappropriate use of milestono or
                        any of its Services, P.I.N PVT.Limited will respond in any way that,
                        in its sole discretion, P.I.N PVT.Limited deems appropriate. You
                        acknowledge that P.I.N PVT.Limited will have the right to report to
                        law enforcement authorities any actions that may be considered
                        illegal, as well as any information it receives of such illegal
                        conduct. When requested, P.I.N PVT.Limited will co-operate fully
                        with law enforcement agencies in any investigation of alleged
                        illegal activity on the Internet.{'\n\n'}
                        P.I.N PVT.Limited reserves all other rights.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>19. Grievances</Text>
                    <Text style={styles.text}>
                        In case you have any complaints and/or grievances in relation to any
                        grievances, you can send your complaints via our grievance portal
                        located at:{'\n\n'}
                        <Text style={styles.bold}>
                            https://www.milestono.com/load/Company/grievances?lstAcn=T&C&lstAcnId=0&src=FTR
                        </Text>
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>20. Amendment</Text>
                    <Text style={styles.text}>
                        Please report any violations of these terms and conditions to P.I.N
                        PVT.Limited at legal@milestono.com{'\n\n'}
                        <Text style={styles.bold}>Effective from: 25th March 2021</Text>
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    content: {
        maxWidth: 800,
        alignSelf: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
        letterSpacing: 0.5,
        textAlign: 'center',
    },
    lastUpdated: {
        fontSize: 16,
        color: '#777777',
        fontStyle: 'italic',
        letterSpacing: 0.5,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 16,
        borderBottomWidth: 2,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 8,
    },
    text: {
        fontSize: 16,
        color: '#777777',
        lineHeight: 24,
        marginBottom: 20,
    },
    bold: {
        fontWeight: '600',
        color: '#333333',
    },
    tableOfContentsSection: {
        backgroundColor: '#f4f5f7',
        padding: 16,
        marginBottom: 30,
        borderRadius: 19,
    },
    dropdownHeader: {
        paddingVertical: 16,
        paddingHorizontal: 0,
    },
    dropdownHeaderOpen: {
        paddingBottom: 8,
    },
    tableOfContentsTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333333',
        textAlign: 'center',
    },
    tableOfContents: {
        paddingBottom: 16,
    },
    tocItem: {
        fontSize: 16,
        color: '#0d6efd',
        fontWeight: '500',
        marginBottom: 8,
        paddingLeft: 16,
    },
});

export default TermsCondition;
