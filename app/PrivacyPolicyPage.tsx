import React from 'react';
import { View, Text, ScrollView, StyleSheet , StatusBar} from 'react-native';

const PrivacyPolicy: React.FC = () => {
    const statusBarHeight = StatusBar.currentHeight || 0;
    return (
        <ScrollView style={[styles.container, { marginTop: statusBarHeight }]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>PRIVACY POLICY</Text>
                    <Text style={styles.lastUpdated}>Last updated 1 January, 2025</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Privacy Policy</Text>
                    <Text style={styles.text}>
                        We, at P.I.N PVT.Limited and our affiliated companies worldwide, are
                        committed to respecting your online privacy and recognize your need
                        for appropriate protection and management of any personally
                        identifiable information you share with us.{'\n\n'}
                        This Privacy Policy ("<Text style={styles.bold}>Policy</Text>") governs our website
                        available at milestono.com and our mobile application (collectively,
                        the "<Text style={styles.bold}>Platform</Text>"). The Policy describes how P.I.N
                        PVT.Limited India Limited (hereinafter referred to as the "
                        <Text style={styles.bold}>Company</Text>") collects, uses, discloses and transfers
                        personal data of users while browsing the <Text style={styles.bold}>Platform</Text>{' '}
                        or availing specific services therein (the "
                        <Text style={styles.bold}>Services</Text>").{'\n\n'}
                        This Policy describes how we process personal data of all users of
                        our Platform or Services, including buyers, renters, owners,
                        dealers, brokers, and website visitors.{'\n\n'}"<Text style={styles.bold}>Personal Data</Text>" means any data about an
                        individual who is identifiable by or in relation to such data.
                        {'\n\n'}
                        By providing your consent to this Policy, either on the Platform or
                        through other means, or accessing the Platform and Services, you
                        consent to the Company's processing of your Personal Data in
                        accordance with this Policy. Where required, for processing your
                        Personal Data for distinct purposes, we seek your consent separately
                        on the Platform or through other means.{'\n\n'}
                        This Privacy Policy is divided into the following sections:{'\n'}
                        1. Personal Data we collect{'\n'}
                        2. How we use your Personal Data{'\n'}
                        3. Who we share your Personal Data with{'\n'}
                        4. Data storage and retention{'\n'}
                        5. Your rights{'\n'}
                        6. Data protection practices{'\n'}
                        7. Third party websites, apps and services{'\n'}
                        8. Children{'\n'}
                        9. Changes to the privacy policy{'\n'}
                        10. How to contact us – Grievance office{'\n\n'}
                        <Text style={styles.bold}>1. Personal Data we collect:</Text>
                        {'\n\n'}
                        We collect the following types of Personal Data about you when you
                        access our Platform or Services:{'\n\n'}
                        <Text style={styles.bold}>A. Information you give us:</Text> {'\n\n'}
                        We collect information you provide to us directly when you use our
                        Platforms (like when you sign-up/ register an account, or post a
                        property listings). We may also collect this information over calls,
                        emails, messages, or other communications established with you to
                        create, update or maintain your details on the Platform. Further, We
                        may also collect this information when you provide it by filling out
                        relevant forms to express your interest in availing our Services.
                        This information includes:{'\n\n'}
                        • <Text style={styles.bold}>Personal Details:</Text> This includes your name,
                        contact information (like addresses, e-mail addresses, phone
                        number), and login information (like username).{'\n\n'}
                        • <Text style={styles.bold}>Property Details:</Text> This includes the details of
                        the property such as nature the of property (like commercial,
                        residential, etc), location details, property profile (like
                        area, dimensions, road connectivity), photographs of your
                        property (if any), pricing details and details of the amenities.
                        {'\n\n'}
                        • <Text style={styles.bold}>Identification Documents:</Text> This includes any
                        information that helps us identify and verify you (such as
                        Aadhaar, voter id, driver's license, PAN, passport, etc) or your
                        property (such as, utility bills, sales deed, property
                        registration documents, property tax documents, etc).{'\n\n'}
                        • <Text style={styles.bold}>Payment Information:</Text> We use third-party payment
                        service providers to process your payments. You will be
                        re-directed to a third-party interface which will collect the
                        required information from you to process the payment
                        transaction. The payment transaction will also be governed by
                        the policies of such third-party service provider, including
                        their privacy policy. We may receive certain transaction details
                        from third-party payment service providers. However, we do not
                        store and do not have access to your financial information such
                        as your bank account numbers, credit/ debit card numbers, or UPI
                        handle.{'\n\n'}
                        • <Text style={styles.bold}>Communications Details:</Text> This includes records
                        of your calls, emails, messages or your communications in other
                        forms related to any feedback, comments, queries, issue reports,
                        customer support, or other communications that you send to us,
                        among other things.{'\n\n'}
                        • <Text style={styles.bold}>Voice Recordings:</Text> Where you choose to include
                        voiceovers in your property listings and property videos, we may
                        collect your voice samples and voice recordings to generate and
                        process the voiceover for playback in your property listing
                        videos.{'\n\n'}
                        • Any other information that you provide to us with your
                        permissions, consents or preferences.{'\n\n'}
                        <Text style={styles.bold}>
                            B. Information we collect when you use our Platforms:
                        </Text>
                        {'\n\n'}
                        When you use our Platforms, we collect certain types of Information
                        about how you use or access our Platforms. This includes:{'\n\n'}
                        • <Text style={styles.bold}>Usage data:</Text> Data collected and processed about
                        you when you access the Platform, such as your search queries,
                        intent capture, your account settings, times at which you access
                        the Platforms, time spent on certain pages, inferences of your
                        interests and preferences based on your usage.{'\n\n'}
                        • <Text style={styles.bold}>Technical data:</Text> Technical data may include data
                        about the devices, software and technology you use such as
                        hardware model, operating system, IP address, preferred
                        languages, unique device identifiers, advertising identifiers,
                        serial numbers, device motion data, network data and web browser
                        details.{'\n\n'}
                        • <Text style={styles.bold}>General or approximate location data:</Text>General
                        location data, such as your city, region, or country. This may
                        be understood from technical data such as your IP address.
                        {'\n\n'}
                        • <Text style={styles.bold}>Communication data:</Text> When you communicate with
                        the Platform or use the Platform to communicate with other
                        members (such as other users, advertisers, dealers and builders
                        etc.), the Company collects and stores information about your
                        communication and any other information you provide.{'\n\n'}
                        • <Text style={styles.bold}>Cookies data:</Text> We use cookies or other similar
                        technologies (like web beacons, log files, etc) to recognise
                        your device, remember you and support the continuity of your
                        experience.Cookies are files which are downloaded to your device
                        when you access our website or web apps.{'\n\n'}
                        • <Text style={styles.bold}>Purchase or transactional data:</Text> Transactional
                        details, such as details about your purchase orders and the
                        payments to and from your accounts with us. However, we do not
                        store and do not have access to your financial information such
                        as your bank account numbers, credit/ debit card numbers, or UPI
                        handle.{'\n\n'}
                        • <Text style={styles.bold}>App-specific permissions:</Text> This includes
                        permissions for Notifications, Camera, Location, Phone (Dialer),
                        Photos and videos on mobile devices. Most app-specific
                        permissions require manual approval by you. If you have given
                        the Platform access to non-essential permissions, but wish to
                        turn them off, you can do so through your phone's settings. The
                        app may not function in case you revoke certain essential app
                        permissions. Since app permissions can change from time to time,
                        we may provide additional information about specific app
                        permissions within the app, or on the Platform-specific app
                        store, such as on the App Store or Play Store.{'\n\n'}
                        • <Text style={styles.bold}>Insight data:</Text> We may use your data to derive
                        insights into your usage of our Platform.{'\n\n'}
                        <Text style={styles.bold}>C. Information we receive from other sources:</Text>
                        {'\n\n'}
                        • We may receive information about you from third parties, such
                        as, advertising and marketing partners. We may collect your
                        information through property campaigns and publicly available
                        sources.{'\n\n'}
                        • We may also receive information from third parties, when you use
                        a third-party account, like SSO/MFA/2FA providers , to log in or
                        upload information to the Platform. This information may include
                        name, email, phone number, location.{'\n\n'}
                        <Text style={styles.bold}>2. How we use your Personal Data:</Text>
                        {'\n\n'}
                        The Platform may process your Personal Data for the following
                        purposes:
                        <Text style={styles.bold}>A. Provision of the Platform and Services:</Text>
                        {'\n\n'}
                        We use your Personal Data to provide the Services and access to
                        Platform, and to enable you to use the various features of the
                        Platforms. For instance, we may use your data{'\n\n'}
                        • for account creation, onboarding and registration purposes.
                        {'\n'}
                        • for listing your properties or for properties which you are
                        authorised to advertise or extending the listing of your
                        properties or for properties which you are authorised to
                        advertise are on the Platform or for recording your interest in
                        a particular property or type of properties.{'\n'}
                        • for establishing connectivity with other members of the Platform
                        (such as other users, advertisers, dealers and builders, banks,
                        NBFCs, banking agents, etc.) or for enabling other members of
                        the Platform to contact you for a period of a reasonable period
                        from the last activity on the Platform.{'\n'}
                        • for giving visibility into your profile and property listing to
                        other users of the Platform; or for providing you with relevant
                        details of a particular property or types of properties{'\n'}
                        • for generating or providing voiceover playbacks in video
                        property listings or{'\n'}
                        • for providing you customised search results or for recommending
                        users or properties or advertisers or for purchase by advertiser
                        that might be relevant to you or your interest.{'\n\n'}
                        <Text style={styles.bold}>B. Our marketing activities:</Text> We may use Personal
                        Data to provide you marketing and promotional material and notify
                        you of discounts and offers, about our Platform and Services or
                        about third-party services, if you've consented to receive such
                        communication from us.{'\n\n'}
                        <Text style={styles.bold}>C. Third-party marketing activities:</Text> Based on your
                        expression of interest, that we receive from you, we may share your
                        Personal Data with third-parties (like banks, NBFCs, banking agents,
                        etc.) - so that they can contact you for their own
                        promotional/marketing purposes.{'\n\n'}
                        <Text style={styles.bold}>D. For Platform and Service improvement:</Text> We may use
                        Personal Data to improve our Platform and its content, to ideate,
                        develop and provide new or better Platform features or Services. For
                        this purpose, we may use data collected through the information you
                        provide us through your feedbacks, through our marketing research
                        and surveys or through the use of the Platform. We may also use
                        Personal Data for providing a better user experience on the Platform
                        and to personalise the Platform for improving your usability of the
                        Platform. The Platform uses YouTube API services. In order to check
                        the performance of a video we may track the video play, pause,
                        mute/unmute action performed by the user on the Platform.{'\n\n'}
                        <Text style={styles.bold}>E. For fraud prevention:</Text> We may use Personal Data
                        for identifying suspicious users or property listings on the
                        Platform, for verifying users and property listing on Platform, for
                        ensuring network security; and to prevent, detect, investigate and
                        prosecute crimes (including but not limited to fraud and other
                        financial crimes) on the Platform. We may also undertake other due
                        diligence checks on suspicious users or property listings, including
                        government sanctions screening and we may seek additional
                        information from you, for such purpose.{'\n\n'}
                        <Text style={styles.bold}>F. For troubleshooting and recover:</Text> We may use your
                        Personal Data to troubleshoot issues or problems with the Platform
                        or Services and for maintain adequate backs-ups to ensure high
                        availability, and aid in disaster recovery.{'\n\n'}
                        <Text style={styles.bold}>G. Analytics Operations:</Text> We may collect and use
                        analytics information together with your Personal Data to build a
                        broader profile of our users so that the Company can serve you
                        better and provide custom, personalized content, and information.
                        {'\n\n'}
                        <Text style={styles.bold}>H. Legal Obligation:</Text> In some cases, the Company
                        will need to collect Personal Data to comply with any legal
                        obligation and to establish, exercise or defending legal rights in
                        connection with legal proceedings (including any prospective legal
                        proceedings) and seeking professional or legal advice in relation to
                        such legal proceedings, and to protect the safety and integrity of
                        our Platforms.{'\n\n'}
                        <Text style={styles.bold}>I. For communicating with you:</Text> We use your personal
                        data to respond to your queries, comments, or feedback, resolve
                        issues faced by you on a Platform or related to a product or
                        service, and to implement your suggestions. We may also be
                        contacting you in relation to providing you access to the Platform
                        or for helping you use the Platform or the Services.{'\n\n'}
                        <Text style={styles.bold}>J. For grievance redressa:</Text> We may use your Personal
                        Data to address your grievances and to respond to your complaints.
                        {'\n\n'}
                        <Text style={styles.bold}>3. Cookies:</Text>
                        {'\n\n'}
                        Some of our web pages utilize "<Text style={styles.bold}>Cookies</Text>"
                        and other tracking technologies. A Cookie is a small text file that
                        may be used, for example, to collect information about web-site
                        activity. Some cookies and other technologies may serve to recall
                        Personal Data previously indicated by a user.{'\n\n'}
                        Most browsers allow you to control cookies, including whether or not
                        to accept them and how to remove them. You may set most browsers to
                        notify you if you receive a cookie, or you may choose to block
                        cookies with your browser, but please note that if you choose to
                        erase or block your cookies, your experience on our platform might
                        be affect.{'\n\n'}
                        Tracking technologies may record information such as Internet domain
                        and host names; Internet protocol (IP) addresses; browser software
                        and operating system types; clickstream patterns; and dates and
                        times that our site is accessed. Our use of cookies and other
                        tracking technologies allows us to improve our Platform and the
                        overall website experience. We may also analyse information that
                        does not contain Personal Information for trends and statistics.
                        {'\n\n'}
                        <Text style={styles.bold}>4. Who we share your personal data with:</Text>
                        {'\n\n'}
                        <Text style={styles.bold}>A. Information you give us:</Text>
                        {'\n\n'}
                        The Company may disclose Personal Data only for the purposes
                        explained in this Privacy Policy, with the following third parties:
                        {'\n\n'}
                        • <Text style={styles.bold}>Service Providers:</Text> The Company may disclose
                        Personal Data (overriding NDNC registration) with service
                        providers, vendors, consultants, agents, field verifiers, or
                        others who assist the Company in operating the Platform or
                        providing the Services. This may include entities engaged in
                        delivering programs, products, information, generating voiceover
                        playbacks for video listings and Services, maintenance of the
                        Platform and mailing lists, verifying properties.{'\n\n'}
                        • <Text style={styles.bold}>Other Platform users:</Text> The Company may, share
                        your information with other users of the Platform, such as
                        owners, renters, brokers, dealers, etc. to establish
                        connectivity with such other users of the Platform. The other
                        users of the Platform may be able to access your contact details
                        to communicate with you, regarding your property listing or your
                        interest in a particular property or type of properties.
                        {'\n\n'}
                        • <Text style={styles.bold}>Banking Partners:</Text> The Company may share your
                        Personal Data with participating banks,NBFCs, their employees or
                        their agents (banking agents), based on your expression of
                        interest regarding home loans. The banking partners may contact
                        you to offer their products or services.{'\n\n'}
                        • <Text style={styles.bold}>Legal Purpose:</Text> The Company shares personal data
                        when required by law, such as responding to subpoenas, court
                        orders, or legal process, or to establish or exercise legal
                        rights or defending against legal claims.{'\n\n'}
                        • <Text style={styles.bold}>Corporate Restructuring:</Text> The Company may share
                        personal data with an another Company pursuant to any corporate
                        re-organisation, amalgamation or restructuring. In this event,
                        the Company will notify you before information about you is
                        transferred and becomes subject to a different privacy policy.
                        {'\n\n'}
                        • <Text style={styles.bold}>Other Third Parties:</Text>The Company may share your
                        Personal Data with other third parties, on a need-to-know basis,
                        such as accountants, lawyers, auditors, etc.{'\n\n'}
                        Please note that the Platform sometimes displays advertisements or
                        contains links to third party websites that may collect personal
                        data, and those are not governed by this Policy. The Company will
                        not be responsible for the privacy practices of such websites. The
                        Company recommends that you review the privacy policy of each
                        third-party site linked from the Platform to determine their use of
                        your Personal Data.{'\n\n'}
                        <Text style={styles.bold}>5. User Rights:</Text>
                        {'\n\n'}
                        • if you wish to access, verify, correct, complete, update or
                        erase any of your Personal Data collected through the Platforms
                        or Services, you may write to us at feedback@milestono.com.
                        {'\n\n'}
                        • You may withdraw your consent for any or all processing of your
                        Personal Data by [services@milestono.com]. Do note however, that
                        the Company reserves the right to refuse to provide you access
                        to the Platform and Services in circumstances where such
                        Personal Data is essential to the provision of the Platform and
                        Services.{'\n\n'}
                        • We (or our service providers or partners) may communicate with
                        you through voice calls, text messages, emails, Platform
                        notifications, or other means. The communication may relate to
                        (a) your purchases, payments, or other messages related to your
                        use of the Platform, or (b) offers or promotions about our
                        Platform, new features or Services. You may opt out of receiving
                        information about promotional offers by writing to our grievance
                        officer. We may still need to send you non-promotional
                        communication (information about the Platforms and Services).
                        {'\n\n'}
                        Please note that the Platform sometimes displays advertisements or
                        contains links to third party websites that may collect personal
                        data, and those are not governed by this Policy. The Company will
                        not be responsible for the privacy practices of such websites. The
                        Company recommends that you review the privacy policy of each
                        third-party site linked from the Platform to determine their use of
                        your Personal Data.
                        {'\n\n'}
                        <Text style={styles.bold}>6. Storage and Protection of personal data:</Text>
                        {'\n\n'}
                        • Our Company is located in India. We store and process your
                        personal data in India. However, we may transfer your personal
                        data to our service providers or partners in other parts of the
                        world.{'\n\n'}
                        • The security and confidentiality of your personal data is
                        important to us and Company has invested significant resources
                        to protect the safekeeping and confidentiality of your Personal
                        Data . When using external service providers acting as
                        processors, the Company requires that they adhere to the same
                        standards as the Platform. Regardless of where your Personal
                        Data is transferred or stored, the Company take all steps
                        reasonably necessary to ensure that personal data is kept
                        secure.{'\n\n'}
                        • The Company has physical, electronic, and procedural safeguards
                        that comply with the laws prevalent in India to protect Personal
                        Data and take appropriate security measures to protect against
                        unauthorized access to or unauthorized alteration, disclosure or
                        destruction of data.{'\n\n'}
                        <Text style={styles.bold}>7. Retention of personal data:</Text>
                        {'\n\n'}
                        • Your personal data is processed and retained to enable your
                        access or use of the Platform and Services. We will keep your
                        Personal Data as long as it is necessary to provide you Services
                        on the Platform or for the purposes for which the data was
                        obtained.{'\n\n'}
                        • To ensure compliance with applicable laws or other legal
                        obligations, or to exercise our legal rights, we may need to
                        retain information even after you have requested us to erase
                        your personal data, terminated your account with us, or stopped
                        using the Platform. We may also keep your contact information
                        and other details for fraud prevention, for the exercise/defense
                        of a legal claim, or for providing evidence in legal
                        proceedings, maintaining accurate accounting, financial, and
                        other operational records, resolving disputes, and enforcing the
                        Company's agreements. Post termination, we may continue to
                        store, use, and share aggregated anonymised data for any
                        purpose, including purposes not listed above. Anonymised data
                        cannot be used to identify you.{'\n\n'}
                        <Text style={styles.bold}>8. Third party websites, apps, and services:</Text>
                        {'\n\n'}
                        • The Platform may contain links to third party websites, apps, or
                        services, such as websites of our partners, or third-party
                        websites that contain informational or other content. This
                        Privacy Policy does not apply to collection, use, storage,
                        sharing, etc. by third parties when you visit or interact with
                        their websites or services, even if they are our partners and
                        display our branding on their website or service. Data collected
                        by third parties is subject to their own privacy policies and
                        privacy practices such as the Privacy Policy of Google. You may
                        control the display of your content by using settings available
                        at Google's security settings page.{'\n\n'}
                        • We (and any other affiliate; or any of our Company directors,
                        officers, agents, contractors, sub-contractors or workers) have
                        no responsibility or liability for the content, activities and
                        services relating to those linked websites, and for data
                        collection, use, storage, sharing, etc. by third parties.
                        {'\n\n'}
                        <Text style={styles.bold}>9. Children:</Text>
                        {'\n\n'}
                        The Platform is not intended for use by children under 18 years of
                        age. Any use of Platform by a child under the age of 18 years must
                        be under parental supervision. We do not knowingly collect any
                        information about, or market to, children, minors or anyone under
                        the age of 18. If you are less than 18 years old, we request that
                        you do not visit or use the Platforms, and that you do not submit
                        any Personal Data to us.{'\n\n'}
                        <Text style={styles.bold}>10. Changes to this Privacy Policy:</Text>
                        {'\n\n'}
                        The Platform reserves the right to update, change or modify this
                        Policy at any time. The Policy shall come to effect from the date of
                        such update, change or The Platform reserves the right to update,
                        change or modify this Policy at any time. The Policy shall come to
                        effect from the date of such update, change or modification.
                        {'\n\n'}
                        <Text style={styles.bold}>11. Grievance Redressal:</Text>
                        {'\n\n'}
                        Questions, concerns or complaints related to the processing of your
                        Personal Data may be made to the Grievance Officer appointed by the
                        Company. In case of any grievances please contact.
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
});

export default PrivacyPolicy;
