export interface paths {
    "/portal/organization/billing": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get billing information for the current organization
         * @description Retrieves billing and subscription details for the current organization, including plan status, product category, billing email, and effective plan.
         */
        get: operations["billing"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portal/subscription/upgrade": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Process subscription upgrade with credit
         * @description Applies a subscription plan change for the current organization and returns the applied credit, charge amount, and whether the change takes effect immediately.
         */
        post: operations["upgrade"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/portal/subscription/upgrade/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get upgrade preview with credit calculation
         * @description Calculates the billing impact of changing to a new subscription plan, including available credit, charge amount, and whether the billing date or usage carryover changes.
         */
        get: operations["upgrade-preview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/action/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * User actions across apps
         * @description Securely communicate and perform actions on behalf of users across different apps. It enables an app to send data or trigger actions in another app on behalf of a mutual user by signing messages using the user's Farcaster signer.
         */
        post: operations["publish-farcaster-action"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/app_host/user/event/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Generate event
         * @description Returns event object for app host events. Used if the app host intends to sign the event message instead of using Neynar-hosted signers.
         */
        get: operations["app-host-get-event"];
        put?: never;
        /**
         * Send event
         * @description Post an app_host event to the domain's webhook. Events such as enabling or disabling notifications for a user. Provide either a signed message or the signer UUID of an authorized neynar-hosted signers.
         */
        post: operations["app-host-post-event"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/app_host/user/state/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Enabled notifications
         * @description Returns the current notification state for a specific user across all mini app domains in this app host. Shows which domains have notifications enabled.
         */
        get: operations["app-host-get-user-state"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/auth_address/developer_managed/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Status by auth address
         * @description Fetches the status of a developer managed auth address by auth address
         */
        get: operations["lookup-developer-managed-auth-address"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/auth_address/developer_managed/signed_key/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Register Signed Key
         * @description Allow apps to register an Ethereum addresses as authorized "auth addresses" for a user's Farcaster account, enabling seamless Sign-In With Farcaster (SIWF) across applications without repeated custody wallet authorizations.
         */
        post: operations["register-signed-key-for-developer-managed-auth-address"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/ban/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Ban FIDs from app
         * @description Bans a list of FIDs from the app associated with your API key. Banned users, their casts and reactions will not appear in feeds.
         */
        post: operations["publish-bans"];
        /**
         * Unban FIDs from app
         * @description Deletes a list of FIDs from the app associated with your API key.
         */
        delete: operations["delete-bans"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/ban/list/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Banned FIDs of app
         * @description Fetches all FIDs that your app has banned.
         */
        get: operations["fetch-ban-list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/block/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Block FID
         * @description Adds a block for a given FID.
         */
        post: operations["publish-block"];
        /**
         * Unblock FID
         * @description Deletes a block for a given FID.
         */
        delete: operations["delete-block"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/block/list/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Blocked / Blocked by FIDs
         * @description Fetches all FIDs that a user has blocked or has been blocked by
         */
        get: operations["fetch-block-list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/cast/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * By hash or URL
         * @description Gets information about an individual cast by passing in a Farcaster web URL or cast hash
         */
        get: operations["lookup-cast-by-hash-or-url"];
        put?: never;
        /**
         * Post a cast
         * @description Posts a cast or cast reply. Works with mentions and embeds.
         *     (In order to post a cast `signer_uuid` must be approved)
         */
        post: operations["publish-cast"];
        /**
         * Delete a cast
         * @description Delete an existing cast.
         *     (In order to delete a cast `signer_uuid` must be approved)
         */
        delete: operations["delete-cast"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/cast/conversation/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Conversation for a cast
         * @description Gets all casts related to a conversation surrounding a cast by passing in a cast hash or Farcaster URL. Includes all the ancestors of a cast up to the root parent in a chronological order. Includes all direct_replies to the cast up to the reply_depth specified in the query parameter.
         */
        get: operations["lookup-cast-conversation"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/cast/conversation/summary/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Cast conversation summary
         * @description Generates a summary of all casts related to a conversation surrounding a cast by passing in a cast hash or Farcaster URL.  Summary is generated by an LLM and is intended to be passed as a context to AI agents.
         */
        get: operations["lookup-cast-conversation-summary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/cast/embed/crawl/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Embedded URL metadata
         * @description Crawls the given URL and returns metadata useful when embedding the URL in a cast.
         */
        get: operations["fetch-embedded-url-metadata"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/cast/metrics/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Metrics for casts
         * @description Fetches metrics casts matching a query
         */
        get: operations["fetch-cast-metrics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/cast/quotes/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Cast Quotes
         * @description Fetch casts that quote a given cast
         */
        get: operations["fetch-cast-quotes"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/cast/search/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search for casts
         * @description Search for casts based on a query string, with optional AND filters
         */
        get: operations["search-casts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/casts/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Bulk fetch casts
         * @description Fetch multiple casts using their respective hashes.
         */
        get: operations["fetch-bulk-casts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/channel/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * By ID or parent_url
         * @description Returns details of a channel
         */
        get: operations["lookup-channel"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/channel/bulk/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Bulk fetch
         * @description Returns details of multiple channels
         */
        get: operations["fetch-bulk-channels"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/channel/follow/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Follow a channel
         * @description Follow a channel
         */
        post: operations["follow-channel"];
        /**
         * Unfollow a channel
         * @description Unfollow a channel
         */
        delete: operations["unfollow-channel"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/channel/followers/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * For channel
         * @description Returns a list of followers for a specific channel. Max limit is 1000. Use cursor for pagination.
         */
        get: operations["fetch-followers-for-a-channel"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/channel/followers/relevant/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Relevant followers
         * @description Returns a list of relevant channel followers for a specific FID. This usually shows on a channel as "X, Y, Z follow this channel".
         */
        get: operations["fetch-relevant-followers-for-a-channel"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/channel/list/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch all channels with their details
         * @description Returns a list of all channels with their details
         */
        get: operations["fetch-all-channels"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/channel/member/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Remove user
         * @description Remove a user from a channel or a user's invite to a channel role
         */
        delete: operations["remove-channel-member"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/channel/member/invite/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Accept or reject an invite
         * @description Accept or reject a channel invite
         */
        put: operations["respond-channel-invite"];
        /**
         * Invite
         * @description Invite a user to a channel
         */
        post: operations["invite-channel-member"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/channel/member/invite/list/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Open invites
         * @description Fetch a list of invites, either in a channel or for a user. If both are provided, open channel invite for that user is returned.
         */
        get: operations["fetch-channel-invites"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/channel/member/list/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch members
         * @description Fetch a list of members in a channel
         */
        get: operations["fetch-channel-members"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/channel/search/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search by ID or name
         * @description Returns a list of channels based on ID or name
         */
        get: operations["search-channels"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/channel/trending/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Channels by activity
         * @description Returns a list of trending channels based on activity
         */
        get: operations["fetch-trending-channels"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/channel/user/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch channels that user is active in
         * @description Fetches all channels that a user has casted in, in reverse chronological order.
         */
        get: operations["fetch-users-active-channels"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/feed/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * By filters
         * @description Fetch casts based on filters. Ensure setting the correct parameters based on the feed_type and filter_type.
         */
        get: operations["fetch-feed"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/feed/channels/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * By channel IDs
         * @description Fetch feed based on channel IDs
         */
        get: operations["fetch-feed-by-channel-ids"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/feed/following/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Following
         * @description Fetch feed based on who a user is following
         */
        get: operations["fetch-user-following-feed"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/feed/for_you/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * For you
         * @description Fetch a personalized For You feed for a user
         */
        get: operations["fetch-feed-for-you"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/feed/parent_urls/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * By parent URLs
         * @description Fetch feed based on parent URLs
         */
        get: operations["fetch-feed-by-parent-urls"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/feed/topic/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * By topic
         * @description Fetch feed based on a topic slug.
         */
        get: operations["fetch-feed-by-topic"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/feed/trending/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Trending feeds
         * @description Fetch trending casts or on the global feed or channels feeds. 7d time window available for channel feeds only.
         */
        get: operations["fetch-trending-feed"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/feed/user/casts/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Chronologically
         * @description Fetch casts for a given user FID in reverse chronological order. Also allows filtering by parent_url and channel
         */
        get: operations["fetch-casts-for-user"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/feed/user/popular/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * 10 most popular casts
         * @description Fetch 10 most popular casts for a given user FID; popularity based on replies, likes and recasts; sorted by most popular first
         */
        get: operations["fetch-popular-casts-by-user"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/feed/user/replies_and_recasts/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Replies and recasts
         * @description Fetch recent replies and recasts for a given user FID; sorted by most recent first
         */
        get: operations["fetch-replies-and-recasts-for-user"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/fname/availability/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Check fname availability
         * @description Check if a given fname is available
         */
        get: operations["is-fname-available"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/followers/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Followers
         * @description Returns a list of followers for a specific FID.
         */
        get: operations["fetch-user-followers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/followers/reciprocal/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Reciprocal Followers
         * @description Returns users who the given FID follows and they follow the FID back (reciprocal following relationship)
         */
        get: operations["fetch-user-reciprocal-followers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/followers/relevant/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Relevant followers
         * @description Returns a list of relevant followers for a specific FID. This usually shows on a profile as "X, Y and Z follow this user".
         */
        get: operations["fetch-relevant-followers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/following/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Following
         * @description Fetch a list of users who a given user is following. Can optionally include a viewer_fid and sort_type.
         */
        get: operations["fetch-user-following"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/following/suggested/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Suggest Follows
         * @description Fetch a list of suggested users to follow. Used to help users discover new users to follow
         */
        get: operations["fetch-follow-suggestions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/frame/catalog/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Mini apps catalog
         * @description A curated list of featured mini apps
         */
        get: operations["fetch-frame-catalog"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/frame/notification_tokens/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List of mini app notification tokens
         * @description Returns a list of notifications tokens related to a mini app
         */
        get: operations["fetch-notification-tokens"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/frame/notifications/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get notification campaign stats
         * @description Retrieve notification delivery and opened stats for notification campaigns
         */
        get: operations["get-notification-campaign-stats"];
        put?: never;
        /**
         * Send notifications
         * @description Send notifications to interactors of a mini app. By default every broadcast is delivered synchronously and returns 200 with aggregate counts. When the `ASYNC_NOTIFICATIONS_ENABLED` server flag is on, broadcasts with more than 100 notification tokens are queued and return 202 with a campaign_id instead; poll the campaign stats endpoint for progress. Small broadcasts always stay synchronous.
         */
        post: operations["publish-frame-notifications"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/frame/relevant/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Relevant mini apps
         * @description Fetch a list of mini apps relevant to the user based on casts by users with strong affinity score for the user
         */
        get: operations["fetch-relevant-frames"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/frame/search/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search mini apps
         * @description Search for mini apps based on a query string
         */
        get: operations["search-frames"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/frame/transaction/pay/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get transaction pay mini app
         * @description Retrieves details about a transaction pay mini app by ID
         */
        get: operations["get-transaction-pay-frame"];
        put?: never;
        /**
         * Create transaction pay mini app
         * @description Creates a new transaction pay mini app that can be used to collect payments through a mini app
         */
        post: operations["create-transaction-pay-frame"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/fungible/owner/relevant/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Relevant owners
         * @description Fetch a list of relevant owners for a on chain asset. If a viewer is provided, only relevant holders will be shown. This usually shows on a fungible asset page as "X, Y, Z and N others you know own this asset".
         */
        get: operations["fetch-relevant-fungible-owners"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/fungible/owner/relevant/bulk": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Bulk relevant owners
         * @description Fetch relevant owners for multiple on chain assets in a single request, up to 10 contract addresses at a time.
         */
        get: operations["fetch-bulk-relevant-fungible-owners"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/fungible/send/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Send fungibles
         * @description Send fungibles in bulk to several farcaster users. A funded wallet is to required use this API. React out to us on the Neynar channel on farcaster to get your wallet address.
         */
        post: operations["send-fungibles-to-users"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/fungible/trades/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get fungible trades
         * @description Get recent trades for a specific fungible within a timeframe. Returns trades ordered by timestamp (most recent first).
         */
        get: operations["fetch-fungible-trades"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/fungible/trending/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Trending fungibles
         * @description Fetch trending fungibles based on buy activity from watched addresses. Returns fungibles ranked by USD buy volume and buy count within the specified time window.
         */
        get: operations["fetch-trending-fungibles"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/fungibles/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch fungibles
         * @description Fetch details for fungible assets identified by fungible identifiers.
         */
        get: operations["fetch-fungibles"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/login/authorize/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch authorization url
         * @description Fetch authorization url (Fetched authorized url useful for SIWN login operation)
         */
        get: operations["fetch-authorization-url"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/login/nonce/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch nonce
         * @description Nonce to sign a message
         */
        get: operations["fetch-nonce"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/message/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Publish message
         * @description Publish a message to farcaster. The message must be signed by a signer managed by the developer. Use the @farcaster/core library to construct and sign the message. Use the Message.toJSON method on the signed message and pass the JSON in the body of this POST request.
         */
        post: operations["publish-message-to-farcaster"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/mute/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mute FID
         * @description Adds a mute for a given FID. This is an allowlisted API, reach out if you want access.
         */
        post: operations["publish-mute"];
        /**
         * Unmute FID
         * @description Deletes a mute for a given FID. This is an allowlisted API, reach out if you want access.
         */
        delete: operations["delete-mute"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/mute/list/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Muted FIDs of user
         * @description Fetches all FIDs that a user has muted.
         */
        get: operations["fetch-mute-list"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/nft/deploy/erc721/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Deploy ERC-721 collection
         * @description Deploy a new ERC-721A (series) NFT collection.
         */
        post: operations["deploy-erc721"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/nft/image/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Generate an NFT image
         * @description Generate a new image or edit existing images using AI. Returns a publicly accessible URL to the generated image.
         */
        post: operations["generate-image"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/nft/metadata/token": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload NFT token metadata
         * @description Uploads metadata JSON to S3 for one or more tokens on a deployed contract. Requires contract ownership via the wallet header.
         */
        post: operations["upload-token-metadata"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/nft/mint/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Simulate NFT mint calldata
         * @description Simulates mint calldata for the given recipients, contract, and network. Useful for previewing calldata and ABI before minting.
         */
        get: operations["simulate-nft-mint"];
        put?: never;
        /**
         * Mint NFT(s)
         * @description Mints an NFT to one or more recipients on a specified network and contract, using a configured server wallet. Contact us to set up your wallet configuration if you don't have one.
         */
        post: operations["mint-nft"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/notifications/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * For user
         * @description Returns a list of notifications for a specific FID.
         */
        get: operations["fetch-all-notifications"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/notifications/channel/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * For user by channel
         * @description Returns a list of notifications for a user in specific channels
         */
        get: operations["fetch-channel-notifications-for-user"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/notifications/parent_url/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * For user by parent_urls
         * @description Returns a list of notifications for a user in specific parent_urls
         */
        get: operations["fetch-notifications-by-parent-url-for-user"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/notifications/seen/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Mark as seen
         * @description Mark notifications as seen.
         *     You can choose one of two authorization methods, either:
         *       1. Provide a valid signer_uuid in the request body (Most common)
         *       2. Provide a valid, signed "Bearer" token in the request's `Authorization` header similar to the
         *          approach described [here](https://docs.farcaster.xyz/reference/warpcast/api#authentication)
         */
        post: operations["mark-notifications-as-seen"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/reaction/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Post a reaction
         * @description Post a reaction (like or recast) to a given cast
         *     (In order to post a reaction `signer_uuid` must be approved)
         */
        post: operations["publish-reaction"];
        /**
         * Delete reaction
         * @description Delete a reaction (like or recast) to a cast
         *     (In order to delete a reaction `signer_uuid` must be approved)
         */
        delete: operations["delete-reaction"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/reactions/cast/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Reactions for cast
         * @description Fetches reactions for a given cast
         */
        get: operations["fetch-cast-reactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/reactions/user/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Reactions for user
         * @description Fetches reactions for a given user
         */
        get: operations["fetch-user-reactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/signer/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Status
         * @description Gets information status of a signer by passing in a signer_uuid (Use post API to generate a signer)
         */
        get: operations["lookup-signer"];
        put?: never;
        /**
         * Create signer
         * @description Creates a signer and returns the signer status.
         *
         *     **Note**: While tesing please reuse the signer, it costs money to approve a signer.
         */
        post: operations["create-signer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/signer/developer_managed/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Status by public key
         * @description Fetches the status of a developer managed signer by public key
         */
        get: operations["lookup-developer-managed-signer"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/signer/developer_managed/signed_key/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Register Signed Key
         * @description Registers an signed key and returns the developer managed signer status with an approval url.
         */
        post: operations["register-signed-key-for-developer-managed-signer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/signer/list/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List signers
         * @description Fetches a list of signers for a custody address
         */
        get: operations["fetch-signers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/signer/signed_key/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Register Signed Key
         * @description Registers an app FID, deadline and a signature. Returns the signer status with an approval url.
         */
        post: operations["register-signed-key"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/storage/allocations/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Allocation of user
         * @description Fetches storage allocations for a given user
         */
        get: operations["lookup-user-storage-allocations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/storage/buy/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Buy storage
         * @description This api will help you rent units of storage for an year for a specific FID.
         *     A storage unit lets you store 5000 casts, 2500 reactions and 2500 links. Requires x-wallet-id header.
         */
        post: operations["buy-storage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/storage/usage/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Usage of user
         * @description Fetches storage usage for a given user
         */
        get: operations["lookup-user-storage-usage"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/topic/trending/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch trending topics
         * @description Returns a list of trending topics for casts.
         */
        get: operations["list-trending-topics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/user/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Register new account
         * @description Register account on farcaster. Optionally provide x-wallet-id header to use your own wallet.
         *
         *     **Note:** This API must be called within 10 minutes of the fetch FID API call (i.e., /v2/farcaster/user/fid). Otherwise, Neynar will assign this FID to another available user.
         */
        post: operations["register-account"];
        delete?: never;
        options?: never;
        head?: never;
        /**
         * Update user profile
         * @description Update user profile
         *     (In order to update user's profile `signer_uuid` must be approved)
         */
        patch: operations["update-user"];
        trace?: never;
    };
    "/v2/farcaster/user/balance/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Token balance
         * @description Fetches the token balances of a user given their FID
         */
        get: operations["fetch-user-balance"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/user/best_friends/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Best friends
         * @description Returns the best friends of a user ranked by mutual affinity score based on interactions with each other.
         */
        get: operations["get-user-best-friends"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/user/bulk-by-address/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * By Eth or Sol addresses
         * @description Fetches all users based on multiple Ethereum or Solana addresses.
         *
         *     Each farcaster user has a custody Ethereum address and optionally verified Ethereum or Solana addresses. This endpoint returns all users that have any of the given addresses as their custody or verified Ethereum or Solana addresses.
         *
         *     A custody address can be associated with only 1 farcaster user at a time but a verified address can be associated with multiple users.
         *     You can pass in Ethereum and Solana addresses, comma separated, in the same request. The response will contain users associated with the given addresses.
         */
        get: operations["fetch-bulk-users-by-eth-or-sol-address"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/user/bulk/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * By FIDs
         * @description Fetches information about multiple users based on FIDs
         */
        get: operations["fetch-bulk-users"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/user/by_location/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * By location
         * @description Fetches a list of users given a location
         */
        get: operations["fetch-users-by-location"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/user/by_username/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * By username
         * @description Fetches a single hydrated user object given a username
         */
        get: operations["lookup-user-by-username"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/user/by_x_username/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * By X username
         * @description Fetches the users who have verified the specified X (Twitter) username
         */
        get: operations["lookup-users-by-x-username"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/user/channels/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Following
         * @description Returns a list of all channels with their details that a FID follows.
         */
        get: operations["fetch-user-channels"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/user/custody-address/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * By custody-address
         * @description Lookup a user by custody-address
         */
        get: operations["lookup-user-by-custody-address"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/user/fid/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch fresh FID
         * @description Fetches FID to [assign it to new user](https://docs.neynar.com/reference/register-account).
         */
        get: operations["get-fresh-account-FID"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/user/follow/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Follow user
         * @description Follow a user
         *     (In order to follow a user `signer_uuid` must be approved)
         */
        post: operations["follow-user"];
        /**
         * Unfollow user
         * @description Unfollow a user
         *     (In order to unfollow a user `signer_uuid` must be approved)
         */
        delete: operations["unfollow-user"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/user/interactions/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * User interactions
         * @description Returns a list of interactions between two users
         */
        get: operations["fetch-user-interactions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/user/memberships/list/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Member of
         * @description Returns a list of all channels with their details that an FID is a member of. Data may have a delay of up to 1 hour.
         */
        get: operations["fetch-user-channel-memberships"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/user/register/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Register Farcaster account onchain
         * @description Register a new farcaster account onchain. Optionally you can pass in signers to register a new account and create multiple signers in a single transaction. Requires x-wallet-id header.
         */
        post: operations["register-account-onchain"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/user/search/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Search for Usernames
         * @description Search for Usernames
         */
        get: operations["search-user"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/user/subscribed_to/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Subscribed to
         * @description Fetch what FIDs and contracts a FID is subscribed to.
         */
        get: operations["fetch-subscribed-to-for-fid"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/user/subscribers/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Subscribers of a user
         * @description Fetch subscribers for a given FID's contracts. Doesn't return addresses that don't have an FID.
         */
        get: operations["fetch-subscribers-for-fid"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/user/subscriptions_created/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Subscriptions created by FID
         * @description Fetch created subscriptions for a given FID's.
         */
        get: operations["fetch-subscriptions-for-fid"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/user/verification/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Add verification
         * @description Adds verification for an eth address or contract for the user
         *     (In order to add verification `signer_uuid` must be approved)
         */
        post: operations["publish-verification"];
        /**
         * Delete verification
         * @description Removes verification for an eth address for the user
         *     (In order to delete verification `signer_uuid` must be approved)
         */
        delete: operations["delete-verification"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/user/verifications/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch verifications
         * @description Fetch all Ethereum and Solana verified addresses for a Farcaster user. Use this endpoint to identify which wallets are associated with which Farcaster applications for the specified user.
         */
        get: operations["fetch-verifications"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/farcaster/webhook/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Fetch a webhook
         * @description Fetch a webhook
         */
        get: operations["lookup-webhook"];
        /**
         * Update a webhook
         * @description Update a webhook
         */
        put: operations["update-webhook"];
        /**
         * Create a webhook
         * @description Create a webhook
         */
        post: operations["publish-webhook"];
        /**
         * Delete a webhook
         * @description Delete a webhook
         */
        delete: operations["delete-webhook"];
        options?: never;
        head?: never;
        /**
         * Update webhook status
         * @description Update webhook active status
         */
        patch: operations["update-webhook-active-status"];
        trace?: never;
    };
    "/v2/farcaster/webhook/list/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Associated webhooks of user
         * @description Fetch a list of webhooks associated to a user
         */
        get: operations["fetch-webhooks"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/fungible/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Deploy fungible
         * @description Creates a new token.
         *     This is an allowlisted API, reach out if you want access.
         */
        post: operations["deploy-fungible"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/onchain/token/balances": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get wallet token balances
         * @description Fetch all token balances for a wallet address across multiple networks. Results are paginated.
         */
        get: operations["get-wallet-balances"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/onchain/token/metadata": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get token metadata
         * @description Fetch metadata for a specific token including price, market data, and basic information. Data is fetched from onchain-indexer with fallback to third-party providers.
         */
        get: operations["get-token-metadata"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/onchain/token/metadata/batch": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Batch get token metadata
         * @description Fetch metadata for multiple tokens in a single request. Provide comma-separated networks and addresses in the same order. Maximum 100 tokens per request.
         */
        get: operations["batch-get-token-metadata"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/signature/x402/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create x402 signature
         * @description Create a signature for a given x402 resource using the specified wallet.
         */
        post: operations["create-x402-signature"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/signature/x402/siwx": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create x402 Sign-In-With-X payload
         * @description Create a Sign-In-With-X payload for a wallet-backed x402 resource.
         */
        post: operations["create-x402-siwx"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/stp/subscription_check/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Hypersub subscription check
         * @description Check if a wallet address is subscribed to a given STP (Hypersub) contract.
         */
        get: operations["fetch-subscription-check"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/credit-drops/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get most recent credit drop
         * @description Returns the most recent credit drop for the authenticated user. Returns the drop regardless of claimed/expired status.
         */
        get: operations["get-credit-drop"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/credit-drops/claim": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Claim credit drop
         * @description Claims the most recent credit drop for the authenticated user. The drop's allowance is surfaced dynamically until expires_at and does not mutate extra_credits. Only drops created within the past 24 hours can be claimed.
         */
        post: operations["claim-credit-drop"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List deployments
         * @description Lists all miniapp generator deployments for a user. Requires API key authentication. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        get: operations["list-deployments"];
        put?: never;
        /**
         * Create a miniapp generator deployment
         * @description Creates and deploys an instance of the miniapp generator for a user. Requires authentication via API key in the request header. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        post: operations["create-deployment"];
        /**
         * Delete deployment(s)
         * @description Deletes a specific miniapp generator deployment or all deployments for a FID. If deployment_id or name is provided, deletes single deployment. If only FID is provided, deletes all deployments for that FID. Requires API key authentication. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        delete: operations["delete-deployment"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/account-association": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get account association of a miniapp
         * @description Retrieves the account-association.json file from a miniapp deployment, which contains the JFS-signed domain association. Requires API key authentication.
         */
        get: operations["get-account-association"];
        put?: never;
        /**
         * Set account association
         * @description Associates a generated miniapp with a Farcaster account using a JFS-signed domain association. Requires API key authentication. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        post: operations["associate-deployment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/build": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Build generated app with automatic error fixing
         * @description Runs Next.js build process for the generated app. If build fails, automatically calls a build-fixer agent to resolve errors. Streams build output and agent responses via Server-Sent Events. Requires API key authentication. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        post: operations["build"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/by-name-and-fid": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get deployment info
         * @description Fetches info about a miniapp generator deployment by its deployment_id or name and creator's Farcaster ID. Requires API key authentication. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        get: operations["get-deployment"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/conversations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List conversations for a deployment
         * @description Lists all conversations for a specific deployment. Requires API key authentication. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        get: operations["list-conversations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/conversations/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get messages in a conversation
         * @description Retrieves messages in a specific conversation with cursor-based pagination (newest first). Requires API key authentication. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        get: operations["get-conversation-messages"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/database/provision": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Provision a database for a deployment
         * @description Provisions a Neon PostgreSQL database for the deployment, or validates and attaches a user-provided (BYO) connection string. Idempotent — returns success if already provisioned.
         */
        post: operations["provision"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/database/query": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Query table data
         * @description Query data from a table with pagination and sorting.
         */
        post: operations["query-table"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/database/sql": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Execute raw SQL query (admin only)
         * @description Executes a raw SQL query against the deployment database. Only SELECT, WITH, and EXPLAIN queries are allowed. Admin access required.
         */
        post: operations["execute-sql"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/database/tables": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List all tables in deployment database
         * @description Lists all tables and views in the deployment database, excluding system tables.
         */
        get: operations["list-tables"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/database/tables/{table_name}/rows": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Insert rows into table
         * @description Inserts one or more rows into the specified table. Returns the inserted rows with generated values.
         */
        post: operations["insert-rows"];
        /**
         * Delete rows from table
         * @description Deletes rows matching the WHERE conditions. WHERE clause is required to prevent accidental bulk deletes.
         */
        delete: operations["delete-rows"];
        options?: never;
        head?: never;
        /**
         * Update rows in table
         * @description Updates rows matching the WHERE conditions. WHERE clause is required to prevent accidental bulk updates.
         */
        patch: operations["update-rows"];
        trace?: never;
    };
    "/v2/studio/deployment/database/tables/{table_name}/schema": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get table schema
         * @description Retrieves the complete schema for a table including columns, indexes, and foreign keys.
         */
        get: operations["get-table-schema"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/dev-status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get dev status of a miniapp
         * @description Retrieves the dev-status.json file from a miniapp deployment, which tracks the progress of app development phases. Requires API key authentication. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        get: operations["get-dev-status"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/export-zip": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Export deployment source code as ZIP
         * @description Downloads the generated miniapp source code as a binary ZIP archive (Content-Type: application/zip). Requires a paid Studio subscription (GROWTH, STUDIO_PLUS, STUDIO_MAX, or INTERNAL). The deployment must be running. The 200 response body is a raw binary stream, not JSON.
         */
        get: operations["export-zip"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/file": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get deployment file contents
         * @description Retrieves the contents of a specific file from the generated app. Requires Studio admin authentication or FID ownership validation. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        get: operations["get-deployment-file"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/files": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List deployment files
         * @description Lists files in a directory of the generated app. Requires Studio admin authentication or FID ownership validation. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        get: operations["list-deployment-files"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/prompt/stream": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Prompt a deployment with streaming response
         * @description Sends a prompt to a specific miniapp generator deployment and returns a streaming response using Server-Sent Events. The response is a continuous stream of Server-Sent Events, not a single JSON payload. Each event contains a JSON object with type, message, and other fields specific to the message type. Requires authentication via API key in the request header. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        post: operations["prompt-deployment-stream"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/recover": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Recover dev server with two-phase strategy
         * @description Attempts to recover a broken dev server. Phase 1: reads dev server error logs and sends them to an AI agent for fixing, then waits for HMR to auto-rebuild. Phase 2: if HMR fails, falls back to a full npm build with AI retry loop. Streams progress events via Server-Sent Events. Requires API key authentication. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        post: operations["recover"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/secrets/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List deployment secrets
         * @description Retrieves all secrets for a deployment.
         */
        get: operations["list-secrets"];
        put?: never;
        /**
         * Upsert deployment secrets
         * @description Upsert secrets for a deployment.
         */
        post: operations["upsert-secrets"];
        /**
         * Delete deployment secrets
         * @description Deletes environment variables (secrets) from a deployment.
         */
        delete: operations["delete-secrets"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/session/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Cancel an active Claude session for a deployment
         * @description Cancels an in-progress Claude Code session for a deployment. Safe to call even if no session is active — returns cancelled: false in that case.
         */
        post: operations["cancel-session"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Start generated miniapp
         * @description Starts the Next.js development server for the generated miniapp. Requires Studio admin authentication. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        post: operations["start-app"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/stop": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Stop generated miniapp
         * @description Stops the Next.js development server for the generated miniapp. Requires Studio admin authentication. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        post: operations["stop-app"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/upload-image": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload image to deployment
         * @description Uploads an image file to the generated miniapp public folder. The image will be accessible as a static asset on the deployed miniapp. Requires API key authentication. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        post: operations["upload-image"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/deployment/upload-image-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Upload image from URL to deployment
         * @description Downloads an image from the provided URL and saves it to the generated miniapp public folder. The image will be accessible as a static asset on the deployed miniapp. Requires API key authentication. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        post: operations["upload-image-url"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/usage/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Report studio compute unit usage
         * @description Called by miniapp-generator instances to report Claude SDK usage. Idempotent — duplicate submissions (same idempotency_key) are accepted but not double-counted.
         */
        post: operations["report-studio-usage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/vercel/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Deploy miniapp to Vercel
         * @description Publishes the generated miniapp to Vercel via GitHub. Creates a GitHub repository, pushes code, creates a Vercel project linked to GitHub, and triggers deployment. Requires API key authentication. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        post: operations["deploy-to-vercel"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/vercel/domain": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * Assign a custom subdomain to a deployed miniapp
         * @description Assigns a custom *.neynar.app subdomain to the user's deployed miniapp. The new domain is added to the Vercel project alongside the existing auto-assigned domain. The productionDomain in the database is updated to the custom domain. Requires API key authentication. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        put: operations["assign-custom-domain"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/vercel/domain/check": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Check if a custom subdomain is available
         * @description Checks whether a custom *.neynar.app subdomain is available for assignment. Validates format, checks reserved names, and verifies no other active deployment is using it. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        get: operations["check-domain-availability"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/vercel/logs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Vercel deployment build logs
         * @description Retrieves the build logs for a Vercel deployment. Useful for debugging failed deployments. Requires Studio admin authentication. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        get: operations["vercel-deployment-logs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v2/studio/vercel/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Vercel deployment status
         * @description Retrieves the status of a Vercel deployment for a miniapp. Looks up the Vercel project ID from the deployment and queries Vercel API for deployment status. Requires API key authentication. Note: Studio CU is tracked based on LLM token usage, not per API call.
         */
        get: operations["vercel-deployment-status"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** AddVerificationReqBody */
        AddVerificationReqBody: {
            address: components["schemas"]["EthAddress"];
            /** @example 0x191905a9201170abb55f4c90a4cc968b44c1b71cdf3db2764b775c93e7e22b29 */
            block_hash: string;
            chain_id?: components["schemas"]["VerificationChainId"];
            /** @example 0x2fc09da1f4dcb723fefb91f77932c249c418c0af00c66ed92ee1f35002c80d6a1145280c9f361d207d28447f8f7463366840d3a9309036cf6954afd1fd331beb1b */
            eth_signature: string;
            signer_uuid: components["schemas"]["SignerUUID"];
            verification_type?: components["schemas"]["VerificationType"];
        };
        /**
         * AddressBalance
         * @description The token balances associated with a wallet address
         */
        AddressBalance: {
            /** @enum {string} */
            object: "address_balance";
            token_balances: components["schemas"]["TokenBalance"][];
            verified_address: {
                /** @description The wallet address */
                address: string;
                network: components["schemas"]["Network"];
            };
        };
        /** AppHostGetEventResponse */
        AppHostGetEventResponse: {
            /**
             * @description Legacy event type corresponding to the requested event type:
             *     - frame_added: User adds a mini app to their account
             *     - frame_removed: User removes a mini app from their account
             *     - notifications_enabled: User enables notifications for a mini app
             *     - notifications_disabled: User disables notifications for a mini app
             */
            event: string;
            /** @description Details for notification setup, only present when event is notifications_enabled */
            notificationDetails?: {
                /** @description Token to use when sending notifications to this user */
                token: string;
                /** @description URL endpoint for sending notifications */
                url: string;
            };
        };
        /**
         * AppHostPostEventReqBody
         * @description Request body for app host events. Can either provide a signed_message or a signer_uuid with event details.
         */
        AppHostPostEventReqBody: components["schemas"]["SignedMessageBody"] | components["schemas"]["SignerUuidBody"];
        /** AppHostPostEventResponse */
        AppHostPostEventResponse: {
            /** @example Successfully processed event */
            message?: string;
            /** @example true */
            success: boolean;
        };
        /** AppHostUserStateResponse */
        AppHostUserStateResponse: {
            /** @description List of domains for which notifications are enabled for this user */
            notifications_enabled: {
                /** @description Domain of the mini app */
                domain: string;
                /** @description Status of notifications for this domain (usually 'valid') */
                status: string;
                /**
                 * Format: date-time
                 * @description When the notification preference was last updated
                 */
                updated_at: string;
            }[];
        };
        /** AuthorizationUrlResponse */
        AuthorizationUrlResponse: {
            /** Format: uri */
            authorization_url: string;
        };
        /** BalanceResponse */
        BalanceResponse: {
            user_balance?: {
                address_balances: components["schemas"]["AddressBalance"][];
                /** @enum {string} */
                object: "user_balance";
                user: components["schemas"]["UserDehydrated"];
            };
        };
        /** BanListResponse */
        BanListResponse: {
            bans: components["schemas"]["BanRecord"][];
            next: components["schemas"]["NextCursor"];
        };
        /** BanRecord */
        BanRecord: {
            banned?: components["schemas"]["User"];
            /** Format: date-time */
            banned_at: string;
            /** @enum {string} */
            object: "ban";
        };
        /** BanReqBody */
        BanReqBody: {
            fids: components["schemas"]["Fid"][];
        };
        /** BanResponse */
        BanResponse: {
            message?: string | null;
            /** @example true */
            success: boolean;
        };
        /** BestFriendsResponse */
        BestFriendsResponse: {
            next?: components["schemas"]["NextCursor"];
            users: {
                fid: number;
                mutual_affinity_score: number;
                username: string;
            }[];
        };
        /** BlockListResponse */
        BlockListResponse: {
            blocks: components["schemas"]["BlockRecord"][];
            next: components["schemas"]["NextCursor"];
        };
        /** BlockRecord */
        BlockRecord: {
            blocked?: components["schemas"]["User"];
            /** Format: date-time */
            blocked_at: string;
            blocker?: components["schemas"]["User"];
            /** @enum {string} */
            object: "block";
        };
        /** BlockReqBody */
        BlockReqBody: {
            blocked_fid: components["schemas"]["Fid"];
            signer_uuid: components["schemas"]["SignerUUID"];
        };
        /** BulkCastsResponse */
        BulkCastsResponse: {
            casts: components["schemas"]["Cast"][];
        };
        /** BulkFollowResponse */
        BulkFollowResponse: {
            details: components["schemas"]["FollowResponse"][];
            success: boolean;
        };
        /** BulkRelevantFungibleOwnersResponse */
        BulkRelevantFungibleOwnersResponse: {
            [key: string]: {
                all_relevant_fungible_owners_dehydrated: components["schemas"]["UserDehydrated"][];
                top_relevant_fungible_owners_hydrated: components["schemas"]["User"][];
            };
        };
        /** BulkUsersByAddressResponse */
        BulkUsersByAddressResponse: {
            [key: string]: components["schemas"]["User"][];
        };
        /** BulkUsersResponse */
        BulkUsersResponse: {
            users: components["schemas"]["User"][];
        };
        /** BuyStorageReqBody */
        BuyStorageReqBody: {
            /**
             * Format: int32
             * @description The unique identifier of a farcaster user or app (unsigned integer)
             * @example 1
             */
            fid: number;
            idem?: components["schemas"]["Idem"];
            /**
             * @description Number of storage units to buy.
             *     A storage unit lets you store 5000 casts, 2500 reactions and 2500 links.
             * @example 1
             */
            units?: number;
        };
        /** Cast */
        Cast: {
            app?: components["schemas"]["UserDehydrated"] | null;
            author: components["schemas"]["User"];
            author_channel_context?: components["schemas"]["ChannelUserContext"];
            channel: Omit<components["schemas"]["ChannelOrChannelDehydrated"], "object"> | null;
            embeds: components["schemas"]["Embed"][];
            hash: string;
            mentioned_channels: components["schemas"]["ChannelDehydrated"][];
            /**
             * @description Positions within the text (inclusive start, exclusive end) where each mention occurs.
             *     Each index within this list corresponds to the same-numbered index in the mentioned_channels list.
             */
            mentioned_channels_ranges: components["schemas"]["TextRange"][];
            mentioned_profiles: components["schemas"]["User"][];
            /**
             * @description Positions within the text (inclusive start, exclusive end) where each mention occurs.
             *     Each index within this list corresponds to the same-numbered index in the mentioned_profiles list.
             */
            mentioned_profiles_ranges: components["schemas"]["TextRange"][];
            /** @enum {string} */
            object: "cast";
            parent_author: {
                fid: components["schemas"]["Fid"] | null;
            };
            parent_hash: string | null;
            parent_url: string | null;
            reactions: components["schemas"]["CastReactions"];
            replies: components["schemas"]["CastReplies"];
            root_parent_url: string | null;
            text: string;
            thread_hash: string | null;
            /** Format: date-time */
            timestamp: string;
            type?: components["schemas"]["CastNotificationType"];
            viewer_context?: components["schemas"]["CastViewerContext"];
        };
        /** CastAndConversations */
        CastAndConversations: {
            app?: components["schemas"]["UserDehydrated"] | null;
            author: components["schemas"]["User"];
            author_channel_context?: components["schemas"]["ChannelUserContext"];
            channel: Omit<components["schemas"]["ChannelOrChannelDehydrated"], "object"> | null;
            /** @description note: This is recursive. It contains the direct replies to the cast and their direct replies up to n reply_depth. */
            direct_replies: components["schemas"]["CastAndConversationsRef"][];
            embeds: components["schemas"]["Embed"][];
            hash: string;
            mentioned_channels: components["schemas"]["ChannelDehydrated"][];
            /**
             * @description Positions within the text (inclusive start, exclusive end) where each mention occurs.
             *     Each index within this list corresponds to the same-numbered index in the mentioned_channels list.
             */
            mentioned_channels_ranges: components["schemas"]["TextRange"][];
            mentioned_profiles: components["schemas"]["User"][];
            /**
             * @description Positions within the text (inclusive start, exclusive end) where each mention occurs.
             *     Each index within this list corresponds to the same-numbered index in the mentioned_profiles list.
             */
            mentioned_profiles_ranges: components["schemas"]["TextRange"][];
            /** @enum {string} */
            object: "cast";
            parent_author: {
                fid: components["schemas"]["Fid"] | null;
            };
            parent_hash: string | null;
            parent_url: string | null;
            reactions: components["schemas"]["CastReactions"];
            replies: components["schemas"]["CastReplies"];
            root_parent_url: string | null;
            text: string;
            thread_hash: string | null;
            /** Format: date-time */
            timestamp: string;
            type?: components["schemas"]["CastNotificationType"];
            viewer_context?: components["schemas"]["CastViewerContext"];
        };
        /**
         * CastAndConversationsRef
         * @description Reference to CastAndConversations to avoid circular reference
         */
        CastAndConversationsRef: {
            app?: components["schemas"]["UserDehydrated"] | null;
            author: components["schemas"]["User"];
            author_channel_context?: components["schemas"]["ChannelUserContext"];
            channel: Omit<components["schemas"]["ChannelOrChannelDehydrated"], "object"> | null;
            /** @description note: This is recursive. It contains the direct replies to the cast and their direct replies up to n reply_depth. */
            direct_replies: Record<string, never>[];
            embeds: components["schemas"]["Embed"][];
            hash: string;
            mentioned_channels: components["schemas"]["ChannelDehydrated"][];
            /**
             * @description Positions within the text (inclusive start, exclusive end) where each mention occurs.
             *     Each index within this list corresponds to the same-numbered index in the mentioned_channels list.
             */
            mentioned_channels_ranges: components["schemas"]["TextRange"][];
            mentioned_profiles: components["schemas"]["User"][];
            /**
             * @description Positions within the text (inclusive start, exclusive end) where each mention occurs.
             *     Each index within this list corresponds to the same-numbered index in the mentioned_profiles list.
             */
            mentioned_profiles_ranges: components["schemas"]["TextRange"][];
            /** @enum {string} */
            object: "cast";
            parent_author: {
                fid: components["schemas"]["Fid"] | null;
            };
            parent_hash: string | null;
            parent_url: string | null;
            reactions: components["schemas"]["CastReactions"];
            replies: components["schemas"]["CastReplies"];
            root_parent_url: string | null;
            text: string;
            thread_hash: string | null;
            /** Format: date-time */
            timestamp: string;
            type?: components["schemas"]["CastNotificationType"];
            viewer_context?: components["schemas"]["CastViewerContext"];
        };
        /** CastDehydrated */
        CastDehydrated: {
            app?: components["schemas"]["UserDehydrated"] | null;
            author?: components["schemas"]["UserDehydrated"];
            hash: string;
            /** @enum {string} */
            object: "cast_dehydrated";
        };
        /** CastEmbedCrawlResponse */
        CastEmbedCrawlResponse: {
            metadata: components["schemas"]["EmbedUrlMetadata"];
        };
        /** CastEmbedded */
        CastEmbedded: {
            app?: components["schemas"]["UserDehydrated"] | null;
            author: components["schemas"]["UserDehydrated"];
            channel: components["schemas"]["ChannelDehydrated"] | null;
            embeds: components["schemas"]["EmbedDeep"][];
            hash: string;
            parent_author: {
                fid: components["schemas"]["Fid"] | null;
            };
            parent_hash: string | null;
            parent_url: string | null;
            root_parent_url: string | null;
            text: string;
            /** Format: date-time */
            timestamp: string;
        };
        /**
         * CastId
         * @deprecated
         * @description [DEPRECATED: Use "cast" key instead]
         */
        CastId: {
            fid: components["schemas"]["Fid"];
            hash: string;
        };
        /**
         * CastNotificationType
         * @description The notification type of a cast.
         * @enum {string}
         */
        CastNotificationType: "cast-mention" | "cast-reply";
        /**
         * CastParent
         * @description parent_url of the channel the cast is in, or hash of the cast
         */
        CastParent: string;
        /** CastReactions */
        CastReactions: {
            /**
             * @deprecated
             * @description This has been deprecated and will always be an empty array. The property will be removed in the future
             */
            likes: components["schemas"]["ReactionLike"][];
            /** Format: int32 */
            likes_count: number;
            /**
             * @deprecated
             * @description This has been deprecated and will always be an empty array. The property will be removed in the future
             */
            recasts: components["schemas"]["ReactionRecast"][];
            /** Format: int32 */
            recasts_count: number;
        };
        /** CastReplies */
        CastReplies: {
            /** Format: int32 */
            count: number;
        };
        /** CastResponse */
        CastResponse: {
            cast: components["schemas"]["Cast"];
        };
        /**
         * CastViewerContext
         * @description Adds context on interactions the viewer has made with the cast.
         */
        CastViewerContext: {
            /** @description Indicates if the viewer liked the cast. */
            liked: boolean;
            /** @description Indicates if the viewer recasted the cast. */
            recasted: boolean;
        };
        /** CastsMetrics */
        CastsMetrics: {
            /** Format: int32 */
            cast_count: number;
            /** Format: int32 */
            resolution_in_seconds: number;
            /** Format: date-time */
            start: string;
        };
        /** CastsMetricsResponse */
        CastsMetricsResponse: {
            metrics: components["schemas"]["CastsMetrics"][];
        };
        /** CastsResponse */
        CastsResponse: {
            result: {
                casts: components["schemas"]["Cast"][];
            };
        };
        /** CastsSearchResponse */
        CastsSearchResponse: {
            result: {
                casts: components["schemas"]["Cast"][];
                next: components["schemas"]["NextCursor"];
            };
        };
        /** Channel */
        Channel: {
            /** Format: date-time */
            created_at: string;
            description?: string;
            description_mentioned_profiles?: components["schemas"]["UserDehydrated"][];
            /** @description Positions within the text (inclusive start, exclusive end) where each mention occurs. */
            description_mentioned_profiles_ranges?: components["schemas"]["TextRange"][];
            /** @description Channel's external link. */
            external_link?: {
                title?: string;
                url?: string;
            };
            /** @description Number of followers the channel has. */
            follower_count?: number;
            /** @deprecated */
            hosts?: components["schemas"]["User"][];
            id: string;
            image_url?: string;
            lead?: components["schemas"]["User"];
            /** Format: int32 */
            member_count?: number;
            /**
             * @deprecated
             * @description Use `lead` instead.
             */
            moderator?: components["schemas"]["User"];
            moderator_fids?: components["schemas"]["Fid"][];
            name?: string;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            object: "channel";
            /** Format: uri */
            parent_url?: string;
            /** @example 0x71d5225f77e0164388b1d4c120825f3a2c1f131c */
            pinned_cast_hash?: string;
            url: string;
            viewer_context?: components["schemas"]["ChannelUserContext"];
        };
        /** ChannelActivity */
        ChannelActivity: {
            cast_count_1d: string;
            cast_count_30d: string;
            cast_count_7d: string;
            channel: components["schemas"]["Channel"];
            /** @enum {string} */
            object: "channel_activity";
        };
        /** ChannelDehydrated */
        ChannelDehydrated: {
            id: string;
            image_url?: string;
            name: string;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            object: "channel_dehydrated";
            viewer_context?: components["schemas"]["ChannelUserContext"];
        };
        /** ChannelFollowReqBody */
        ChannelFollowReqBody: {
            channel_id: components["schemas"]["ChannelId"];
            signer_uuid: components["schemas"]["SignerUUID"];
        };
        /**
         * ChannelId
         * @description The unique identifier of a farcaster channel
         * @example neynar
         */
        ChannelId: string;
        /** ChannelListResponse */
        ChannelListResponse: {
            channels: components["schemas"]["Channel"][];
            next?: components["schemas"]["NextCursor"];
        };
        /** ChannelMember */
        ChannelMember: {
            channel: components["schemas"]["Channel"] | components["schemas"]["ChannelDehydrated"];
            /** @enum {string} */
            object: "member";
            role: components["schemas"]["ChannelMemberRole"];
            user: components["schemas"]["UserDehydrated"] | components["schemas"]["User"];
        };
        /** ChannelMemberInvite */
        ChannelMemberInvite: {
            channel_id: components["schemas"]["ChannelId"];
            invited: components["schemas"]["User"];
            inviter: components["schemas"]["User"];
            role: components["schemas"]["ChannelMemberRole"];
        };
        /** ChannelMemberInviteListResponse */
        ChannelMemberInviteListResponse: {
            invites: components["schemas"]["ChannelMemberInvite"][];
            next?: components["schemas"]["NextCursor"];
        };
        /** ChannelMemberListResponse */
        ChannelMemberListResponse: {
            members: components["schemas"]["ChannelMember"][];
            next: components["schemas"]["NextCursor"];
        };
        /**
         * ChannelMemberRole
         * @description The role of a channel member
         * @enum {string}
         */
        ChannelMemberRole: "member" | "moderator" | "owner";
        /** ChannelOrChannelDehydrated */
        ChannelOrChannelDehydrated: components["schemas"]["Channel"] | components["schemas"]["ChannelDehydrated"];
        /** ChannelResponse */
        ChannelResponse: {
            channel: components["schemas"]["Channel"];
        };
        /** ChannelResponseBulk */
        ChannelResponseBulk: {
            channels: components["schemas"]["Channel"][];
        };
        /** ChannelSearchResponse */
        ChannelSearchResponse: {
            channels: components["schemas"]["Channel"][];
            next: components["schemas"]["NextCursor"];
        };
        /**
         * ChannelUserContext
         * @description Adds context on the viewer's or author's role in the channel.
         */
        ChannelUserContext: {
            /** @description Indicates if the user is following the channel. */
            following: boolean;
            role?: components["schemas"]["ChannelMemberRole"];
        };
        /**
         * ConflictErrorRes
         * @description Details for the conflict error response
         */
        ConflictErrorRes: {
            code?: string;
            key?: string;
            message: string;
            property?: string;
        };
        /** Conversation */
        Conversation: {
            conversation: {
                cast: components["schemas"]["CastAndConversations"];
                chronological_parent_casts?: components["schemas"]["Cast"][];
            };
            next?: components["schemas"]["NextCursor"];
        };
        /** ConversationSummary */
        ConversationSummary: {
            summary: {
                /** @description Users who were mentioned in a conversation thread */
                mentioned_profiles: components["schemas"]["User"][];
                /** @description Users who casted in a conversation thread */
                participants: components["schemas"]["User"][];
                /** @description Summary generated by an LLM */
                text: string;
            };
        };
        /** DeleteCastReqBody */
        DeleteCastReqBody: {
            signer_uuid: components["schemas"]["SignerUUID"];
            /** @example 0x71d5225f77e0164388b1d4c120825f3a2c1f131c */
            target_hash: string;
        };
        /** DeployFungibleReqBody */
        DeployFungibleReqBody: {
            /**
             * @description Factory name
             *     - wow -> [wow.xyz](https://wow.xyz)
             *     - clanker -> [clanker.world](https://www.clanker.world)
             * @default wow
             * @enum {string}
             */
            factory: "wow" | "clanker";
            /** @description Description of the token */
            "metadata[description]"?: string;
            /** @description Discord server link */
            "metadata[discord]"?: string;
            /**
             * Format: binary
             * @description Media file associated with the token.
             *     Supported formats are image/jpeg, image/gif and image/png
             */
            "metadata[media]"?: string | null;
            /**
             * @description Indicates if the token is NSFW (Not Safe For Work).
             * @enum {string}
             */
            "metadata[nsfw]"?: "true" | "false";
            /** @description Telegram link */
            "metadata[telegram]"?: string;
            /** @description Twitter profile link */
            "metadata[twitter]"?: string;
            /** @description Website link related to the token */
            "metadata[website_link]"?: string;
            /** @description Name of the token */
            name: string;
            /**
             * @description Network/Chain name
             * @default base
             * @enum {string}
             */
            network: "base";
            /** @description Ethereum address of the one who is creating the token */
            owner: string;
            /** @description Symbol/Ticker for the token */
            symbol: string;
        };
        /** DeployFungibleResponse */
        DeployFungibleResponse: {
            contract?: {
                fungible?: {
                    /** @description Contract address of the token */
                    address?: string;
                    /** @description Decimal precision of the token */
                    decimals?: number;
                    /** @description URI of the token media */
                    media?: string;
                    /** @description Name of the token */
                    name?: string;
                    /** @example fungible */
                    object?: string;
                    /** @description Symbol of the token */
                    symbol?: string;
                };
            };
        };
        /** DeveloperManagedSigner */
        DeveloperManagedSigner: {
            fid?: components["schemas"]["Fid"];
            public_key: components["schemas"]["Ed25519PublicKey"];
            signer_approval_url?: string;
            /** @enum {string} */
            status: "pending_approval" | "approved" | "revoked";
        };
        /**
         * Ed25519PublicKey
         * @description Ed25519 public key
         * @example 0x3daa8f99c5f760688a3c9f95716ed93dee5ed5d7722d776b7c4deac957755f22
         */
        Ed25519PublicKey: string;
        /** Embed */
        Embed: components["schemas"]["EmbedCast"] | components["schemas"]["EmbedUrl"];
        /** EmbedCast */
        EmbedCast: {
            cast: components["schemas"]["CastEmbedded"];
            cast_id?: components["schemas"]["CastId"];
        };
        /** EmbedCastDeep */
        EmbedCastDeep: {
            cast: components["schemas"]["CastDehydrated"];
            cast_id?: components["schemas"]["CastId"];
        };
        /** EmbedDeep */
        EmbedDeep: components["schemas"]["EmbedCastDeep"] | components["schemas"]["EmbedUrl"];
        /** EmbedUrl */
        EmbedUrl: {
            metadata?: components["schemas"]["EmbedUrlMetadata"];
            url: string;
        };
        /** EmbedUrlMetadata */
        EmbedUrlMetadata: {
            _status: string;
            content_length?: number | null;
            content_type?: string | null;
            frame?: components["schemas"]["Frame"];
            html?: components["schemas"]["HtmlMetadata"];
            image?: {
                height_px?: number;
                width_px?: number;
            };
            video?: {
                duration_s?: number;
                stream?: {
                    codec_name?: string;
                    height_px?: number;
                    width_px?: number;
                }[];
            };
        };
        /**
         * EncodedJsonFarcasterSignature
         * @description Encoded JSON Farcaster signature
         */
        EncodedJsonFarcasterSignature: {
            header: string;
            payload: string;
            signature: string;
        };
        /**
         * ErrorRes
         * @description Details for the error response
         */
        ErrorRes: {
            code?: string;
            message: string;
            property?: string;
            /** Format: int32 */
            status?: number;
        };
        /**
         * EthAddress
         * @description Ethereum address
         * @example 0x5a927ac639636e534b678e81768ca19e2c6280b7
         */
        EthAddress: string;
        /** FarcasterActionReqBody */
        FarcasterActionReqBody: {
            action: {
                /** @description The payload of the action being performed. */
                payload?: Record<string, never>;
                /**
                 * @description The type of action being performed.
                 * @example create.user
                 */
                type: string;
            };
            /**
             * Format: uri
             * @description The base URL of the app on which the action is being performed.
             * @example https://example.com
             */
            base_url: string;
            /**
             * Format: uuid
             * @description The signer_uuid of the user on behalf of whom the action is being performed.
             * @example 123e4567-e89b-12d3-a456-426614174000
             */
            signer_uuid: string;
        };
        /** FarcasterFungible */
        FarcasterFungible: {
            /** @description The total number of comments on the token */
            cast_count: number;
            fungible: components["schemas"]["Fungible"];
            /** @enum {string} */
            object: "farcaster_fungible";
        };
        /** FarcasterManifest */
        FarcasterManifest: {
            account_association: components["schemas"]["EncodedJsonFarcasterSignature"];
            frame?: {
                button_title?: string;
                /** @description Detailed description of the configuration */
                description?: string;
                /**
                 * Format: uri
                 * @description URL of the hero image displayed for the configuration
                 */
                hero_image_url?: string;
                home_url: string;
                icon_url: string;
                image_url?: string;
                name: string;
                /** @description Whether search engines should not index this configuration */
                noindex?: boolean;
                /** @description Description used for Open Graph previews */
                og_description?: string;
                /**
                 * Format: uri
                 * @description Image URL used for Open Graph previews
                 */
                og_image_url?: string;
                /** @description Title used for Open Graph previews */
                og_title?: string;
                /** @description Primary category the configuration belongs to */
                primary_category?: string;
                /** @description URLs of screenshots showcasing the configuration */
                screenshot_urls?: string[];
                splash_background_color?: string;
                splash_image_url?: string;
                /** @description Short subtitle for the configuration */
                subtitle?: string;
                /** @description Short tagline for the configuration */
                tagline?: string;
                /** @description Tags associated with the configuration */
                tags?: string[];
                /** @enum {string} */
                version: "1" | "0.0.0" | "0.0.1" | "next";
                webhook_url?: string;
            };
            miniapp?: {
                button_title?: string;
                /** @description Detailed description of the configuration */
                description?: string;
                /**
                 * Format: uri
                 * @description URL of the hero image displayed for the configuration
                 */
                hero_image_url?: string;
                home_url: string;
                icon_url: string;
                image_url?: string;
                name: string;
                /** @description Whether search engines should not index this configuration */
                noindex?: boolean;
                /** @description Description used for Open Graph previews */
                og_description?: string;
                /**
                 * Format: uri
                 * @description Image URL used for Open Graph previews
                 */
                og_image_url?: string;
                /** @description Title used for Open Graph previews */
                og_title?: string;
                /** @description Primary category the configuration belongs to */
                primary_category?: string;
                /** @description URLs of screenshots showcasing the configuration */
                screenshot_urls?: string[];
                splash_background_color?: string;
                splash_image_url?: string;
                /** @description Short subtitle for the configuration */
                subtitle?: string;
                /** @description Short tagline for the configuration */
                tagline?: string;
                /** @description Tags associated with the configuration */
                tags?: string[];
                /** @enum {string} */
                version: "1" | "0.0.0" | "0.0.1" | "next";
                webhook_url?: string;
            };
        };
        /** FeedResponse */
        FeedResponse: {
            casts: components["schemas"]["Cast"][];
            next: components["schemas"]["NextCursor"];
        };
        /**
         * Fid
         * Format: int32
         * @description The unique identifier of a farcaster user or app (unsigned integer)
         * @example 3
         */
        Fid: number;
        /** FnameAvailabilityResponse */
        FnameAvailabilityResponse: {
            available: boolean;
        };
        /** FollowReqBody */
        FollowReqBody: {
            signer_uuid: components["schemas"]["SignerUUID"];
            /**
             * @example [
             *       194,
             *       3
             *     ]
             */
            target_fids: number[];
        };
        /** FollowResponse */
        FollowResponse: {
            hash: string;
            success: boolean;
            target_fid: components["schemas"]["Fid"];
        };
        /** Follower */
        Follower: {
            app?: components["schemas"]["UserDehydrated"];
            /** @enum {string} */
            object: "follower";
            user: components["schemas"]["User"];
        };
        /** FollowerDehydrated */
        FollowerDehydrated: {
            /** @enum {string} */
            object: "follower_dehydrated";
            user: components["schemas"]["UserDehydrated"];
        };
        /** FollowersResponse */
        FollowersResponse: {
            next: components["schemas"]["NextCursor"];
            users: components["schemas"]["Follower"][];
        };
        /** Frame */
        Frame: components["schemas"]["FrameV1"] | components["schemas"]["FrameV2"];
        /** FrameActionButton */
        FrameActionButton: {
            action_type: components["schemas"]["FrameButtonActionType"];
            /** @description Index of the button */
            index: number;
            /** @description Used specifically for the tx action type to post a successful transaction hash */
            post_url?: string;
            /** @description Target of the button */
            target?: string;
            /** @description Title of the button */
            title?: string;
        };
        /**
         * FrameButtonActionType
         * @description The action type of a mini app button. Action types "mint" & "link" are to be handled on the client side only and so they will produce a no/op for POST /farcaster/frame/action.
         * @enum {string}
         */
        FrameButtonActionType: "post" | "post_redirect" | "tx" | "link" | "mint";
        /** FrameCatalogResponse */
        FrameCatalogResponse: {
            frames: components["schemas"]["FrameV2WithFullAuthor"][];
            next: components["schemas"]["NextCursor"];
        };
        /** FrameNotificationTokens */
        FrameNotificationTokens: {
            next: components["schemas"]["NextCursor"];
            notification_tokens: {
                /** Format: date-time */
                created_at?: string;
                fid?: components["schemas"]["Fid"];
                /** @enum {string} */
                object?: "notification_token";
                /** @enum {string} */
                status?: "enabled" | "disabled" | "invalid";
                token?: string;
                /** Format: date-time */
                updated_at?: string;
                url?: string;
            }[];
        };
        /** FramePayTransactionReqBody */
        FramePayTransactionReqBody: {
            config: components["schemas"]["TransactionFrameConfig"];
            idem?: components["schemas"]["Idem"];
            transaction: {
                to: components["schemas"]["TransactionFrameDestination"];
            };
        };
        /**
         * FrameV1
         * @description Mini app v1 object
         */
        FrameV1: {
            buttons?: components["schemas"]["FrameActionButton"][];
            /** @description Launch URL of the mini app */
            frames_url: string;
            /** @description URL of the image */
            image: string;
            image_aspect_ratio?: string;
            input?: {
                /** @description Input text for the mini app */
                text?: string;
            };
            /** @description Post URL to take an action on this mini app */
            post_url?: string;
            state?: {
                /** @description State for the mini app in a serialized format */
                serialized?: string;
            };
            title?: string;
            /** @description Version of the mini app, 'next' for v2, 'vNext' for v1 */
            version: string;
        };
        /**
         * FrameV2
         * @description Mini app v2 object
         */
        FrameV2: {
            author?: components["schemas"]["UserDehydrated"];
            /** @description Launch URL of the mini app */
            frames_url: string;
            /** @description URL of the image */
            image: string;
            manifest?: components["schemas"]["FarcasterManifest"];
            metadata?: {
                html: components["schemas"]["HtmlMetadata"];
            };
            /** @description Button title of a mini app */
            title?: string;
            /** @description Version of the mini app, 'next' for v2, 'vNext' for v1 */
            version: string;
        };
        /**
         * FrameV2WithFullAuthor
         * @description Mini app v2 object with full user object
         */
        FrameV2WithFullAuthor: {
            author?: components["schemas"]["User"];
            /** @description Launch URL of the mini app */
            frames_url: string;
            /** @description URL of the image */
            image: string;
            manifest?: components["schemas"]["FarcasterManifest"];
            metadata?: {
                html: components["schemas"]["HtmlMetadata"];
            };
            /** @description Button title of a mini app */
            title?: string;
            /** @description Version of the mini app, 'next' for v2, 'vNext' for v1 */
            version: string;
        };
        /** Fungible */
        Fungible: {
            /** @description The contract address of the token */
            address: string;
            /** @description The number of decimals the token uses */
            decimals: number;
            /** @description The logo URL of the token */
            logo: string | null;
            /** @description The token name e.g. "Ethereum" */
            name: string;
            network: components["schemas"]["Network"];
            /** @enum {string} */
            object: "fungible";
            /** @description The token symbol e.g. "ETH" */
            symbol: string;
            /** @description The total supply of the token */
            total_supply: string | null;
        };
        /** FungibleBalance */
        FungibleBalance: {
            balance: {
                in_token: string;
                in_usd: number | null;
            };
            /** @enum {string} */
            object: "fungible_balance";
            token: components["schemas"]["Fungible"];
        };
        /**
         * FungiblesResponseSchema
         * @description Response containing fungible details
         */
        FungiblesResponseSchema: {
            fungibles: components["schemas"]["FarcasterFungible"][];
        };
        /** HtmlMetadata */
        HtmlMetadata: {
            favicon?: string;
            modifiedTime?: string;
            oembed?: components["schemas"]["OembedRichData"] | components["schemas"]["OembedVideoData"] | components["schemas"]["OembedPhotoData"] | components["schemas"]["OembedLinkData"];
            ogArticleAuthor?: string;
            ogArticleExpirationTime?: string;
            ogArticleModifiedTime?: string;
            ogArticlePublishedTime?: string;
            ogArticlePublisher?: string;
            ogArticleSection?: string;
            ogArticleTag?: string;
            ogAudio?: string;
            ogAudioSecureURL?: string;
            ogAudioType?: string;
            ogAudioURL?: string;
            ogAvailability?: string;
            ogDate?: string;
            ogDescription?: string;
            ogDeterminer?: string;
            ogEpisode?: string;
            ogImage?: components["schemas"]["ImageObject"][];
            ogLocale?: string;
            ogLocaleAlternate?: string;
            ogLogo?: string;
            ogMovie?: string;
            ogPriceAmount?: string;
            ogPriceCurrency?: string;
            ogProductAvailability?: string;
            ogProductCondition?: string;
            ogProductPriceAmount?: string;
            ogProductPriceCurrency?: string;
            ogProductRetailerItemId?: string;
            ogSiteName?: string;
            ogTitle?: string;
            ogType?: string;
            ogUrl?: string;
            ogVideo?: components["schemas"]["VideoObject"][];
            ogVideoActor?: string;
            ogVideoActorId?: string;
            ogVideoActorRole?: string;
            ogVideoDirector?: string;
            ogVideoDuration?: string;
            ogVideoOther?: string;
            ogVideoReleaseDate?: string;
            ogVideoSecureURL?: string;
            ogVideoSeries?: string;
            ogVideoTag?: string;
            ogVideoTvShow?: string;
            ogVideoWriter?: string;
            ogWebsite?: string;
            updatedTime?: string;
        };
        /**
         * Idem
         * @description An Idempotency key is a unique identifier for the request.
         *     **Note:**
         *     1) This is used to prevent duplicate requests. Use the same idem key on retry attempts.
         *     2) This should be a unique identifier for each request.
         *     3) Recommended format is a 16-character string generated by the developer at the time of making this request.
         */
        Idem: string;
        /** ImageObject */
        ImageObject: {
            alt?: string;
            height?: string;
            type?: string;
            url: string;
            width?: string;
        };
        /** InviteChannelMemberReqBody */
        InviteChannelMemberReqBody: {
            channel_id: components["schemas"]["ChannelId"];
            fid: components["schemas"]["Fid"];
            role: components["schemas"]["ChannelMemberRole"];
            signer_uuid: components["schemas"]["SignerUUID"];
        };
        /**
         * Location
         * @description Coordinates and place names for a location
         */
        Location: {
            address?: components["schemas"]["LocationAddress"];
            /** Format: double */
            latitude: number;
            /** Format: double */
            longitude: number;
            /** @description The radius in meters for the location search. Any location within this radius will be returned. */
            radius?: number;
        };
        /** LocationAddress */
        LocationAddress: {
            city: string;
            country: string;
            country_code?: string;
            state?: string;
            state_code?: string;
        };
        /** MarkNotificationsAsSeenReqBody */
        MarkNotificationsAsSeenReqBody: {
            /** @description The UUID of a signer with at least one write permission.  Required unless a valid Authorization Bearer token is provided in the header. */
            signer_uuid?: string;
            type?: components["schemas"]["NotificationType"];
        };
        /**
         * MiniappDomainResponse
         * @description Response containing domain information, metadata, and validation errors if any
         */
        MiniappDomainResponse: {
            /**
             * Format: date-time
             * @description Creation timestamp
             */
            created_at: string;
            /** @description Domain name */
            domain: string;
            /** @description High-level error message if processing failed */
            error_message?: string;
            /**
             * Format: int32
             * @description FID associated with the domain
             * @example 3
             */
            fid: number;
            /** @description Home URL metadata if available */
            home_url_metadata?: {
                [key: string]: unknown;
            } | null;
            manifest: components["schemas"]["FarcasterManifest"];
            /**
             * Format: date-time
             * @description Last update timestamp
             */
            updated_at: string;
            /** @description Validation errors from processing, if any */
            validation_errors?: string[];
            /** @description Whether the domain was found in the table before processing */
            was_found: boolean;
            /** @description Whether the domain was refreshed/updated during this request */
            was_refreshed: boolean;
        };
        /** MuteListResponse */
        MuteListResponse: {
            mutes: components["schemas"]["MuteRecord"][];
            next: components["schemas"]["NextCursor"];
        };
        /** MuteRecord */
        MuteRecord: {
            muted: components["schemas"]["User"];
            /** Format: date-time */
            muted_at: string;
            /** @enum {string} */
            object: "mute";
        };
        /** MuteReqBody */
        MuteReqBody: {
            fid: components["schemas"]["Fid"];
            muted_fid: components["schemas"]["Fid"];
        };
        /** MuteResponse */
        MuteResponse: {
            message?: string;
            /** @example true */
            success: boolean;
        };
        /**
         * Network
         * @description A blockchain network e.g. "ethereum", "optimism", "base", "arbitrum"
         * @enum {string}
         */
        Network: "ethereum" | "optimism" | "base" | "arbitrum";
        /**
         * NextCursor
         * @description Returns next cursor
         */
        NextCursor: {
            cursor: string | null;
        };
        /** NonceResponse */
        NonceResponse: {
            /**
             * @description The nonce value to sign the message
             * @example neynarbMi9zSDuOC1GFqixR
             */
            nonce: string;
        };
        /** Notification */
        Notification: {
            cast?: components["schemas"]["Cast"];
            /**
             * Format: int32
             * @description The number of notifications of this(follows, likes, recast) type bundled in a single notification.
             */
            count?: number;
            follows?: components["schemas"]["Follower"][];
            /** Format: date-time */
            most_recent_timestamp: string;
            /** @enum {string} */
            object: "notification";
            reactions?: components["schemas"]["ReactionWithUserInfo"][];
            seen: boolean;
            /** @enum {string} */
            type: "follows" | "recasts" | "likes" | "mention" | "reply" | "quote";
        };
        /** NotificationCampaign */
        NotificationCampaign: {
            /** @description The body text of the notification. */
            body: string;
            /**
             * Format: date-time
             * @description When the campaign reached a terminal state (completed/failed/canceled). Null while still queued or running.
             */
            completed_at?: string | null;
            /** Format: date-time */
            created_at: string;
            /**
             * Format: uuid
             * @description The unique identifier for the notification campaign.
             */
            id: string;
            /**
             * Format: date-time
             * @description When the campaign was enqueued for async delivery.
             */
            queued_at?: string;
            stats: components["schemas"]["NotificationCampaignStats"];
            /**
             * @description Lifecycle status of the campaign. Absent on campaigns created before async delivery was introduced.
             * @enum {string}
             */
            status?: "queued" | "running" | "completed" | "failed" | "canceled";
            /** @description The title of the notification campaign. */
            title: string;
        };
        /** NotificationCampaignStats */
        NotificationCampaignStats: {
            /** @description Detailed breakdown of errors encountered during notification delivery. */
            error_breakdown: {
                /** @description A record mapping delivery error types to their occurrence counts. */
                delivery_errors?: {
                    [key: string]: number;
                };
                /** @description A record mapping HTTP status codes to their occurrence counts. */
                http_errors?: {
                    [key: string]: number;
                };
            };
            /** @description An array of Farcaster FIDs of intended recipient applications. */
            intended_recipient_app_fids: number[];
            /**
             * Format: int32
             * @description The total number of notification tokens for intended recipients.
             */
            intended_recipient_notification_token_count: number;
            /**
             * Format: int32
             * @description The number of notifications successfully sent.
             */
            successful_sends: number;
            /** @description A record mapping app FIDs (as strings) to the number of successful sends for that app. */
            successful_sends_by_app_fid: {
                [key: string]: number;
            };
            /**
             * Format: int32
             * @description The total number of times notifications from this campaign have been opened.
             */
            total_opens: number;
            /** @description A record mapping app FIDs (as strings) to the number of opens for that app. */
            total_opens_by_app_fid: {
                [key: string]: number;
            };
            /**
             * Format: int32
             * @description The number of unique recipients who opened a notification from this campaign.
             */
            unique_opens: number;
            /** @description A record mapping app FIDs (as strings) to the number of unique opens for that app. */
            unique_opens_by_app_fid: {
                [key: string]: number;
            };
        };
        /**
         * NotificationCampaignStatus
         * @description Always "queued" for a successful async enqueue.
         * @enum {string}
         */
        NotificationCampaignStatus: "queued" | "running" | "completed" | "failed" | "canceled";
        /**
         * NotificationType
         * @description The type of notification to mark as seen. If not provided, all notifications will be marked as seen.
         * @enum {string}
         */
        NotificationType: "follows" | "recasts" | "likes" | "mentions" | "replies" | "quotes";
        /** NotificationsResponse */
        NotificationsResponse: {
            next: components["schemas"]["NextCursor"];
            notifications: components["schemas"]["Notification"][];
            /** Format: int32 */
            unseen_notifications_count: number;
        };
        /**
         * OembedLinkData
         * @description Link OEmbed data
         */
        OembedLinkData: {
            /** @description The name of the author/owner of the resource. */
            author_name?: string | null;
            /** @description A URL for the author/owner of the resource. */
            author_url?: string | null;
            /** @description The suggested cache lifetime for this resource, in seconds. Consumers may choose to use this value or not. */
            cache_age?: string | null;
            /** @description The name of the resource provider. */
            provider_name?: string | null;
            /** @description The url of the resource provider. */
            provider_url?: string | null;
            /** @description The height of the optional thumbnail. If this parameter is present, thumbnail_url and thumbnail_width must also be present. */
            thumbnail_height?: number | null;
            /** @description A URL to a thumbnail image representing the resource. The thumbnail must respect any maxwidth and maxheight parameters. If this parameter is present, thumbnail_width and thumbnail_height must also be present. */
            thumbnail_url?: string | null;
            /** @description The width of the optional thumbnail. If this parameter is present, thumbnail_url and thumbnail_height must also be present. */
            thumbnail_width?: number | null;
            /** @description A text title, describing the resource. */
            title?: string | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "link";
            version: string | null;
        };
        /**
         * OembedPhotoData
         * @description Photo OEmbed data
         */
        OembedPhotoData: {
            /** @description The name of the author/owner of the resource. */
            author_name?: string | null;
            /** @description A URL for the author/owner of the resource. */
            author_url?: string | null;
            /** @description The suggested cache lifetime for this resource, in seconds. Consumers may choose to use this value or not. */
            cache_age?: string | null;
            /** @description The height in pixels of the image specified in the url parameter. */
            height?: number | null;
            /** @description The name of the resource provider. */
            provider_name?: string | null;
            /** @description The url of the resource provider. */
            provider_url?: string | null;
            /** @description The height of the optional thumbnail. If this parameter is present, thumbnail_url and thumbnail_width must also be present. */
            thumbnail_height?: number | null;
            /** @description A URL to a thumbnail image representing the resource. The thumbnail must respect any maxwidth and maxheight parameters. If this parameter is present, thumbnail_width and thumbnail_height must also be present. */
            thumbnail_url?: string | null;
            /** @description The width of the optional thumbnail. If this parameter is present, thumbnail_url and thumbnail_height must also be present. */
            thumbnail_width?: number | null;
            /** @description A text title, describing the resource. */
            title?: string | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "photo";
            /** @description The source URL of the image. Consumers should be able to insert this URL into an <img> element. Only HTTP and HTTPS URLs are valid. */
            url: string | null;
            version: string | null;
            /** @description The width in pixels of the image specified in the url parameter. */
            width?: number | null;
        };
        /**
         * OembedRichData
         * @description Rich OEmbed data
         */
        OembedRichData: {
            /** @description The name of the author/owner of the resource. */
            author_name?: string | null;
            /** @description A URL for the author/owner of the resource. */
            author_url?: string | null;
            /** @description The suggested cache lifetime for this resource, in seconds. Consumers may choose to use this value or not. */
            cache_age?: string | null;
            /** @description The height in pixels required to display the HTML. */
            height?: number | null;
            /** @description The HTML required to display the resource. The HTML should have no padding or margins. Consumers may wish to load the HTML in an off-domain iframe to avoid XSS vulnerabilities. The markup should be valid XHTML 1.0 Basic. */
            html: string | null;
            /** @description The name of the resource provider. */
            provider_name?: string | null;
            /** @description The url of the resource provider. */
            provider_url?: string | null;
            /** @description The height of the optional thumbnail. If this parameter is present, thumbnail_url and thumbnail_width must also be present. */
            thumbnail_height?: number | null;
            /** @description A URL to a thumbnail image representing the resource. The thumbnail must respect any maxwidth and maxheight parameters. If this parameter is present, thumbnail_width and thumbnail_height must also be present. */
            thumbnail_url?: string | null;
            /** @description The width of the optional thumbnail. If this parameter is present, thumbnail_url and thumbnail_height must also be present. */
            thumbnail_width?: number | null;
            /** @description A text title, describing the resource. */
            title?: string | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "rich";
            version: string | null;
            /** @description The width in pixels required to display the HTML. */
            width?: number | null;
        };
        /**
         * OembedVideoData
         * @description Video OEmbed data
         */
        OembedVideoData: {
            /** @description The name of the author/owner of the resource. */
            author_name?: string | null;
            /** @description A URL for the author/owner of the resource. */
            author_url?: string | null;
            /** @description The suggested cache lifetime for this resource, in seconds. Consumers may choose to use this value or not. */
            cache_age?: string | null;
            /** @description The height in pixels required to display the HTML. */
            height?: number | null;
            /** @description The HTML required to embed a video player. The HTML should have no padding or margins. Consumers may wish to load the HTML in an off-domain iframe to avoid XSS vulnerabilities. */
            html: string | null;
            /** @description The name of the resource provider. */
            provider_name?: string | null;
            /** @description The url of the resource provider. */
            provider_url?: string | null;
            /** @description The height of the optional thumbnail. If this parameter is present, thumbnail_url and thumbnail_width must also be present. */
            thumbnail_height?: number | null;
            /** @description A URL to a thumbnail image representing the resource. The thumbnail must respect any maxwidth and maxheight parameters. If this parameter is present, thumbnail_width and thumbnail_height must also be present. */
            thumbnail_url?: string | null;
            /** @description The width of the optional thumbnail. If this parameter is present, thumbnail_url and thumbnail_height must also be present. */
            thumbnail_width?: number | null;
            /** @description A text title, describing the resource. */
            title?: string | null;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "video";
            version: string | null;
            /** @description The width in pixels required to display the HTML. */
            width?: number | null;
        };
        /** OperationResponse */
        OperationResponse: {
            message?: string;
            success?: boolean;
        };
        /** PostCastReqBody */
        PostCastReqBody: {
            /**
             * @description Channel ID of the channel where the cast is to be posted. e.g. neynar, farcaster, warpcast
             * @example neynar
             */
            channel_id?: string;
            embeds?: components["schemas"]["PostCastReqBodyEmbeds"][];
            idem?: components["schemas"]["Idem"];
            parent?: components["schemas"]["CastParent"];
            parent_author_fid?: components["schemas"]["Fid"];
            signer_uuid: components["schemas"]["SignerUUID"];
            text?: string;
        };
        /** PostCastReqBodyEmbeds */
        PostCastReqBodyEmbeds: {
            cast_id: components["schemas"]["PostCastReqBodyEmbedsCastIdProperties"];
        } | {
            castId: components["schemas"]["PostCastReqBodyEmbedsCastIdProperties"];
        } | {
            url: string;
        };
        /** PostCastReqBodyEmbedsCastIdProperties */
        PostCastReqBodyEmbedsCastIdProperties: {
            fid: components["schemas"]["Fid"];
            hash: string;
        };
        /** PostCastResponse */
        PostCastResponse: {
            cast: {
                author: {
                    fid: components["schemas"]["Fid"];
                };
                /** @example 0x71d5225f77e0164388b1d4c120825f3a2c1f131c */
                hash: string;
                text: string;
            };
            success: boolean;
        };
        /**
         * PrefixedHexString
         * @description Hexadecimal number expressed as string with '0x' prefix
         */
        PrefixedHexString: string;
        /**
         * Protocol
         * @description Blockchain protocol for the linked wallet: evm for Ethereum/EVM-compatible chains (Base, Optimism, etc.) and solana for Solana
         * @example evm
         * @enum {string}
         */
        Protocol: "evm" | "solana";
        /** PublishMessageReqBody */
        PublishMessageReqBody: Record<string, never>;
        /** PublishMessageResponse */
        PublishMessageResponse: Record<string, never>;
        /** QueuedFrameNotificationsResponse */
        QueuedFrameNotificationsResponse: {
            /**
             * Format: uuid
             * @description The unique identifier for the notification campaign.
             */
            campaign_id: string;
            status: components["schemas"]["NotificationCampaignStatus"];
        };
        /** ReactionForCast */
        ReactionForCast: {
            app?: components["schemas"]["UserDehydrated"];
            /** @enum {string} */
            object: "likes" | "recasts";
            /** Format: date-time */
            reaction_timestamp: string;
            reaction_type: components["schemas"]["ReactionType"];
            user: components["schemas"]["User"];
        };
        /** ReactionLike */
        ReactionLike: {
            fid: components["schemas"]["Fid"];
            fname: string;
        };
        /** ReactionRecast */
        ReactionRecast: {
            fid: components["schemas"]["Fid"];
            fname: string;
        };
        /** ReactionReqBody */
        ReactionReqBody: {
            idem?: components["schemas"]["Idem"];
            reaction_type: components["schemas"]["ReactionType"];
            signer_uuid: components["schemas"]["SignerUUID"];
            /**
             * @description Target cast hash (hex string starting with 0x) OR a valid URL.
             * @example 0x3702ec1b298bb7ac6f00346432d959ad7b05b9a8 -OR- http://neynar.com/
             */
            target: string;
            target_author_fid?: components["schemas"]["Fid"];
        };
        /**
         * ReactionType
         * @enum {string}
         */
        ReactionType: "like" | "recast";
        /** ReactionWithCastInfo */
        ReactionWithCastInfo: {
            app?: components["schemas"]["UserDehydrated"];
            cast: components["schemas"]["Cast"];
            /** @enum {string} */
            object: "likes" | "recasts";
            /** Format: date-time */
            reaction_timestamp: string;
            /** @enum {string} */
            reaction_type: "like" | "recast";
            user: components["schemas"]["UserDehydrated"];
        };
        /** ReactionWithUserInfo */
        ReactionWithUserInfo: {
            cast: components["schemas"]["CastDehydrated"];
            /** @enum {string} */
            object: "likes" | "recasts";
            user: components["schemas"]["User"];
        };
        /** ReactionsCastResponse */
        ReactionsCastResponse: {
            next: components["schemas"]["NextCursor"];
            reactions: components["schemas"]["ReactionForCast"][];
        };
        /** ReactionsResponse */
        ReactionsResponse: {
            next: components["schemas"]["NextCursor"];
            reactions: components["schemas"]["ReactionWithCastInfo"][];
        };
        /** ReciprocalFollower */
        ReciprocalFollower: {
            /** @enum {string} */
            object: "reciprocal_follower";
            /** Format: date-time */
            timestamp: string;
            user: components["schemas"]["User"];
        };
        /** RegisterAuthAddressDeveloperManagedSignedKeyReqBody */
        RegisterAuthAddressDeveloperManagedSignedKeyReqBody: {
            address: components["schemas"]["EthAddress"];
            app_fid: components["schemas"]["Fid"];
            /** @description unix timestamp in seconds that controls how long the signed key request is valid for. (24 hours from now is recommended) */
            deadline: number;
            /**
             * @description Url to redirect to after the signer is approved.
             *     **Note** : This should only be used when requesting a signer from a native mobile application.
             */
            redirect_url?: string;
            /**
             * @description Signature generated by the custody address of the app. Signed data includes app_fid, deadline, 32 bytes padded auth address. [Refer guide for more details.](https://docs.neynar.com/docs/auth-address-signature-generation)
             * @example 0x16161933625ac90b7201625bfea0d816de0449ea1802d97a38c53eef3c9c0c424fefbc5c6fb5eabe3d4f161a36d18cda585cff7e77c677c5d34a9c87e68ede011c
             */
            signature: string;
            sponsor?: components["schemas"]["SignedKeyRequestSponsor"];
        };
        /** RegisterDeveloperManagedSignedKeyReqBody */
        RegisterDeveloperManagedSignedKeyReqBody: {
            app_fid: components["schemas"]["Fid"];
            /** @description unix timestamp in seconds that controls how long the signed key request is valid for. (24 hours from now is recommended) */
            deadline: number;
            public_key: components["schemas"]["Ed25519PublicKey"];
            /**
             * @description Url to redirect to after the signer is approved.
             *     **Note** : This should only be used when requesting a signer from a native mobile application.
             */
            redirect_url?: string;
            /**
             * @description Signature generated by the custody address of the app. Signed data includes app_fid, deadline, signer's public key
             * @example 0x7867e84cb6a64bf6e1954e52884133f1114eb3fd97f63ff55fa76c77c80beb6434eea9d3736b59caa3130d63121177acc752dc8a2561e9edf700642f390f92d11b
             */
            signature: string;
            sponsor?: components["schemas"]["SignedKeyRequestSponsor"];
        };
        /** RegisterSignerKeyReqBody */
        RegisterSignerKeyReqBody: {
            app_fid: components["schemas"]["Fid"];
            /** @description unix timestamp in seconds that controls how long the signed key request is valid for. (24 hours from now is recommended) */
            deadline: number;
            /**
             * @description Url to redirect to after the signer is approved.
             *     **Note** : This should only be used when requesting a signer from a native mobile application.
             */
            redirect_url?: string;
            /** @description Signature generated by the custody address of the app. Signed data includes app_fid, deadline, signer's public key */
            signature: string;
            signer_uuid: components["schemas"]["SignerUUID"];
            sponsor?: components["schemas"]["SignedKeyRequestSponsor"];
        };
        /** RegisterUserOnChainReqBody */
        RegisterUserOnChainReqBody: {
            /**
             * @description An Idempotency key is a unique identifier for the request.
             *     **Note:**
             *     1) Pre-registration calls must be idempotent when using idempotency keys.
             *     2) This is used to prevent duplicate requests. Use the same idem key on retry attempts.
             *     3) This should be a unique identifier for each request.
             *     4) Recommended format is a 16-character string generated by the developer at the time of making this request.
             */
            idem?: string;
            pre_registration_calls?: {
                /**
                 * @description Set it to true if you want to ignore the failure of this call. If set to false, the registration will fail if this call fails.
                 * @default false
                 */
                allow_failure: boolean;
                /** @description Call data payload (hex-encoded) */
                data: string;
                /**
                 * @description Must be on the allowed contract allowlist. Contact support for more details.
                 * @example 0x5a927ac639636e534b678e81768ca19e2c6280b7
                 */
                target: string;
                /**
                 * @description Value in wei to send with the transaction. This is not the amount of ETH that will be sent, but rather the value of the transaction.
                 * @default 0
                 */
                value: number;
            }[];
            registration: {
                custody_address: components["schemas"]["EthAddress"];
                /** @example 1715190000 */
                deadline: number;
                recovery_address: components["schemas"]["EthAddress"];
                signature: components["schemas"]["PrefixedHexString"];
            };
            signers?: {
                /** @example 1715190000 */
                deadline: number;
                /** @default 1 */
                key_type: number;
                metadata: components["schemas"]["PrefixedHexString"];
                /** @default 1 */
                metadata_type: number;
                public_key: components["schemas"]["Ed25519PublicKey"];
                signature: components["schemas"]["PrefixedHexString"];
            }[];
            /** @example 2 */
            storage_units?: number;
        };
        /** RegisterUserOnChainResponse */
        RegisterUserOnChainResponse: {
            /** @example Account registered successfully */
            message?: string;
            /** @example 0x2e276b4d014334797d9951ce2d3b7a11a4a58855cb07b3761de36785c618220a */
            transaction_hash?: string;
            user?: components["schemas"]["User"];
        };
        /** RegisterUserReqBody */
        RegisterUserReqBody: {
            deadline: number;
            fid: number;
            fname?: string;
            metadata?: {
                bio?: string;
                display_name?: string;
                location?: {
                    /** Format: double */
                    latitude: number;
                    /** Format: double */
                    longitude: number;
                };
                pfp_url?: string;
                url?: string;
                username?: string;
                verified_accounts?: {
                    github?: string;
                    x?: string;
                };
            };
            requested_user_custody_address: string;
            signature: string;
            signer?: {
                app_fid: number;
                deadline: number;
                signed_key_request_metadata_signature: string;
                /** Format: uuid */
                uuid: string;
            };
        };
        /** RegisterUserResponse */
        RegisterUserResponse: {
            message: string;
            signer?: components["schemas"]["Signer"];
            signers: {
                fid?: components["schemas"]["Fid"];
                /** @enum {string} */
                object?: "signer";
                permissions?: components["schemas"]["SharedSignerPermission"][];
                public_key: components["schemas"]["Ed25519PublicKey"];
                signer_approval_url?: string;
                /** @enum {string} */
                status: "generated" | "pending_approval" | "approved" | "revoked";
                uuid: components["schemas"]["SignerUUID"];
            }[];
            /** @enum {boolean} */
            success: true;
            user?: components["schemas"]["User"];
        };
        /** RelevantFollowersResponse */
        RelevantFollowersResponse: {
            all_relevant_followers_dehydrated: components["schemas"]["FollowerDehydrated"][];
            top_relevant_followers_hydrated: components["schemas"]["Follower"][];
        };
        /** RelevantFungibleOwnersResponse */
        RelevantFungibleOwnersResponse: {
            all_relevant_fungible_owners_dehydrated: components["schemas"]["UserDehydrated"][];
            top_relevant_fungible_owners_hydrated: components["schemas"]["User"][];
        };
        /** RemoveChannelMemberReqBody */
        RemoveChannelMemberReqBody: {
            channel_id: components["schemas"]["ChannelId"];
            fid: components["schemas"]["Fid"];
            role: components["schemas"]["ChannelMemberRole"];
            signer_uuid: components["schemas"]["SignerUUID"];
        };
        /** RemoveVerificationReqBody */
        RemoveVerificationReqBody: {
            address: components["schemas"]["EthAddress"];
            /** @example 0x191905a9201170abb55f4c90a4cc968b44c1b71cdf3db2764b775c93e7e22b29 */
            block_hash: string;
            /** @example 0x2fc09da1f4dcb723fefb91f77932c249c418c0af00c66ed92ee1f35002c80d6a1145280c9f361d207d28447f8f7463366840d3a9309036cf6954afd1fd331beb1b */
            eth_signature: string;
            signer_uuid: components["schemas"]["SignerUUID"];
        };
        /** RespondChannelInviteReqBody */
        RespondChannelInviteReqBody: {
            /** @description Accept or reject the invite */
            accept: boolean;
            channel_id: components["schemas"]["ChannelId"];
            role: components["schemas"]["ChannelMemberRole"];
            signer_uuid: components["schemas"]["SignerUUID"];
        };
        /** SendFrameNotificationsReqBody */
        SendFrameNotificationsReqBody: {
            /**
             * @description Filters to apply to the target_fids set. All filters are additive, so only users matching all filters will be notified.
             * @example {
             *       "exclude_fids": [
             *         2,
             *         8988
             *       ],
             *       "following_fid": 3,
             *       "minimum_user_score": 0.5,
             *       "near_location": {
             *         "latitude": 37.774929,
             *         "longitude": -122.419418,
             *         "radius": 1000
             *       }
             *     }
             */
            filters?: {
                /** @description Only send notifications to users who are not in the given FIDs. */
                exclude_fids?: components["schemas"]["Fid"][];
                /**
                 * Format: int32
                 * @description Only send notifications to users who follow the given FID.
                 * @example 3
                 */
                following_fid?: number;
                /** @description Only send notifications to users with a score greater than or equal to this value. */
                minimum_user_score?: number;
                /** @description Only send notifications to users near a given location. */
                near_location?: {
                    address?: components["schemas"]["LocationAddress"];
                    /** Format: double */
                    latitude: number;
                    /** Format: double */
                    longitude: number;
                    /** @description The radius in meters for the location search. Any location within this radius will be returned. */
                    radius?: number;
                };
            };
            notification: {
                /**
                 * @description The body of the notification. Must be between 1 and 128 characters.
                 * @example You have received a new message in your inbox.
                 */
                body: string;
                /**
                 * Format: uri
                 * @description The target URL to open when the user clicks the notification. Must be a valid URL.
                 * @example https://example.com/notifications
                 */
                target_url: string;
                /**
                 * @description The title of the notification. Must be between 1 and 32 characters.
                 * @example New Message
                 */
                title: string;
                /**
                 * Format: uuid
                 * @description An optional UUID for the notification, used as an idempotency key.
                 * @example 123e4567-e89b-12d3-a456-426614174000
                 */
                uuid?: string;
            };
            /**
             * @description An array of target FIDs to whom the notifications should be sent. Each FID must be a positive integer. Pass an empty array to send notifications to all FIDs with notifications enabled for the mini app.
             * @example [
             *       1,
             *       2,
             *       3
             *     ]
             */
            target_fids?: number[];
        };
        /** SendFrameNotificationsResponse */
        SendFrameNotificationsResponse: {
            /**
             * Format: uuid
             * @description The unique identifier for the notification campaign.
             */
            campaign_id: string;
            /**
             * Format: int32
             * @description The number of notifications that failed to deliver.
             */
            failure_count: number;
            /**
             * Format: int32
             * @description The number of notifications not attempted (e.g., disabled tokens, invalid tokens).
             */
            not_attempted_count: number;
            /** @description List of FIDs that failed due to retryable errors (rate_limited, failed, http_error). Can be used to retry sending notifications to these users. */
            retryable_fids?: components["schemas"]["Fid"][];
            /**
             * Format: int32
             * @description The number of notifications successfully delivered.
             */
            success_count: number;
        };
        /**
         * SharedSignerPermission
         * @enum {string}
         */
        SharedSignerPermission: "WRITE_ALL" | "READ_ONLY" | "NONE" | "PUBLISH_CAST" | "DELETE_CAST" | "PUBLISH_REACTION" | "DELETE_REACTION" | "UPDATE_PROFILE" | "FOLLOW_USER" | "UNFOLLOW_USER" | "FOLLOW_CHANNEL" | "UNFOLLOW_CHANNEL" | "ADD_VERIFICATION" | "REMOVE_VERIFICATION" | "WRITE_FRAME_ACTION";
        /** SignedKeyRequestSponsor */
        SignedKeyRequestSponsor: {
            fid?: components["schemas"]["Fid"];
            /** @description Signature generated by the fid of the sponsor and the signature generated from signKeyRequest for the app. */
            signature?: string;
            /**
             * @description Neynar will sponsor the signer if set to true.
             *     **Note: ** If sponsor.fid and sponsor.signature are provided along with sponsored_by_neynar set to true,
             *     the sponsor.fid and sponsor.signature will be ignored.
             *     Neynar will sponsor the signer on behalf of the user. The developer will get charged in credits.
             */
            sponsored_by_neynar?: boolean;
        };
        /** SignedMessageBody */
        SignedMessageBody: {
            /**
             * @description Domain of the mini app
             * @example demo.neynar.com
             */
            app_domain: string;
            /** @description JFS-signed message containing the event payload. The message must be properly signed and contain valid event information.  Can be provided as a single string or json object. */
            signed_message: string | components["schemas"]["EncodedJsonFarcasterSignature"];
        };
        /** Signer */
        Signer: {
            fid?: components["schemas"]["Fid"];
            /** @enum {string} */
            object?: "signer";
            permissions?: components["schemas"]["SharedSignerPermission"][];
            public_key: components["schemas"]["Ed25519PublicKey"];
            signer_approval_url?: string;
            signer_uuid: components["schemas"]["SignerUUID"];
            /** @enum {string} */
            status: "generated" | "pending_approval" | "approved" | "revoked";
        };
        /** SignerListResponse */
        SignerListResponse: {
            signers: components["schemas"]["Signer"][];
        };
        /**
         * SignerUUID
         * @description UUID of the signer.
         *     `signer_uuid` is paired with API key, can't use a `uuid` made with a different API key.
         * @example 19d0c5fd-9b33-4a48-a0e2-bc7b0555baec
         */
        SignerUUID: string;
        /** SignerUuidBody */
        SignerUuidBody: {
            /** @description Domain of the mini app */
            app_domain: string;
            /**
             * @description Types of events that can occur between a user and an app host:
             *     - frame_added: User adds a mini app to their account
             *     - frame_removed: User removes a mini app from their account
             *     - notifications_enabled: User enables notifications for a mini app
             *     - notifications_disabled: User disables notifications for a mini app
             * @enum {string}
             */
            event: "frame_added" | "frame_removed" | "notifications_enabled" | "notifications_disabled";
            fid: components["schemas"]["Fid"];
            signer_uuid: components["schemas"]["SignerUUID"];
        };
        /**
         * SimulateNftMintResponse
         * @description Calldata simulations for NFT minting.
         */
        SimulateNftMintResponse: {
            /** @description ABI for the mint function. */
            abi?: unknown;
            args: unknown[];
            /**
             * @description Calldata for the mint transaction.
             * @example 0xabcdef
             */
            calldata: string;
            /** @example 0x1234abcd */
            data: string;
            /**
             * @description Estimated total cost in wei (value + gas). Use this for price display.
             * @example 100000000000000
             */
            estimated_total_cost_wei: string;
            /** @example mintTo */
            function_name: string;
            /** @example base */
            network: string;
            /** @description NFT mint recipient. Exactly one of "address" or "fid" must be set. */
            recipient: {
                address: components["schemas"]["EthAddress"];
                fid?: unknown;
                /**
                 * @description Quantity to mint (must be at least 1). Defaults to 1.
                 * @default 1
                 * @example 1
                 */
                quantity: number;
            } | {
                address?: unknown;
                fid: components["schemas"]["Fid"];
                /**
                 * @description Quantity to mint (must be at least 1). Defaults to 1.
                 * @default 1
                 * @example 1
                 */
                quantity: number;
            };
            to: components["schemas"]["EthAddress"];
            /** @example 0 */
            value: string;
        }[];
        /**
         * SolAddress
         * @description Solana address
         */
        SolAddress: string;
        /** StorageAllocation */
        StorageAllocation: {
            /**
             * Format: date-time
             * @example 2024-10-08T22:03:49.000Z
             */
            expiry?: string;
            /** @example storage_allocation */
            object?: string;
            /**
             * Format: date-time
             * @example 2023-10-09T22:03:49.000Z
             */
            timestamp?: string;
            /** @example 10 */
            units?: number;
            user?: components["schemas"]["UserDehydrated"];
        };
        /** StorageAllocationsResponse */
        StorageAllocationsResponse: {
            allocations?: components["schemas"]["StorageAllocation"][];
            /** @example 13 */
            total_active_units?: number;
        };
        /** StorageObject */
        StorageObject: {
            /** @example 10000 */
            capacity?: number;
            /** @example storage */
            object?: string;
            /** @example 3659 */
            used?: number;
        };
        /** StorageUsageResponse */
        StorageUsageResponse: {
            casts?: components["schemas"]["StorageObject"];
            links?: components["schemas"]["StorageObject"];
            /** @example storage_usage */
            object?: string;
            reactions?: components["schemas"]["StorageObject"];
            signers?: components["schemas"]["StorageObject"];
            /** @example 2 */
            total_active_units?: number;
            user?: components["schemas"]["UserDehydrated"];
            username_proofs?: components["schemas"]["StorageObject"];
            verified_addresses?: components["schemas"]["StorageObject"];
        };
        /** SubscribedTo */
        SubscribedTo: {
            /** @example 8453 */
            chain: number;
            /** @example 0xff63fc310d47ef80961056ac8df0b3f1a9e3ef58 */
            contract_address: string;
            creator: components["schemas"]["User"];
            /**
             * Format: date-time
             * @example 2023-09-13T22:10:22.000Z
             */
            expires_at: string;
            metadata: {
                /** @example https://storage.withfabric.xyz/loom/403fdc10-95f3-4b25-9d77-5aac7ccb9fd1.jpg */
                art_url: string;
                /** @example MMS */
                symbol: string;
                /** @example /memes channel sub */
                title: string;
            };
            /** @enum {string} */
            object: "subscription";
            /** @example 0xb6f6dce6000ca88cc936b450cedb16a5c15f157f */
            owner_address: string;
            price: {
                /** @example 0 */
                initial_mint_price: string;
                /** @example 2592000 */
                period_duration_seconds: number;
                /** @example 350574998400000 */
                tokens_per_period: string;
            };
            /** @example 1 */
            protocol_version: number;
            /** @example fabric_stp */
            provider_name?: string;
            /**
             * Format: date-time
             * @example 2023-09-13T22:10:22.000Z
             */
            subscribed_at: string;
            tier: components["schemas"]["SubscriptionTier"];
            tiers?: components["schemas"]["SubscriptionTier"][];
            token: {
                /** @example null */
                address: string | null;
                /** @example 18 */
                decimals: number;
                /** @example false */
                erc20: boolean;
                /** @example ETH */
                symbol: string;
            };
        };
        /** SubscribedToObject */
        SubscribedToObject: {
            /** @example 8453 */
            chain?: number;
            /** @example 0x325b3e2c19f4900f8f4eb5f6872dc2715e77cbac */
            contract_address?: string;
            /**
             * Format: date-time
             * @example 2023-09-13T22:10:22.000Z
             */
            expires_at?: string;
            /** @enum {string} */
            object: "subscription_dehydrated";
            /** @example 1 */
            protocol_version?: number;
            /** @example fabric_stp */
            provider_name: string;
            /**
             * Format: date-time
             * @example 2023-09-13T22:10:22.000Z
             */
            subscribed_at?: string;
            /** @example 0 */
            tier_id?: string;
        };
        /** SubscribedToResponse */
        SubscribedToResponse: {
            subscribed_to?: components["schemas"]["SubscribedTo"][];
        };
        /** Subscriber */
        Subscriber: {
            /** @enum {string} */
            object: "subscriber";
            subscribed_to: components["schemas"]["SubscribedToObject"];
            user: components["schemas"]["User"];
        };
        /** SubscribersResponse */
        SubscribersResponse: {
            subscribers?: components["schemas"]["Subscriber"][];
        };
        /** Subscription */
        Subscription: {
            /** @example 8453 */
            chain: number;
            /** @example 0xff63fc310d47ef80961056ac8df0b3f1a9e3ef58 */
            contract_address: string;
            metadata: {
                /** @example https://storage.withfabric.xyz/loom/403fdc10-95f3-4b25-9d77-5aac7ccb9fd1.jpg */
                art_url: string;
                /** @example MMS */
                symbol: string;
                /** @example /memes channel sub */
                title: string;
            };
            /** @enum {string} */
            object: "subscription";
            /** @example 0xb6f6dce6000ca88cc936b450cedb16a5c15f157f */
            owner_address: string;
            price: {
                /** @example 0 */
                initial_mint_price: string;
                /** @example 2592000 */
                period_duration_seconds: number;
                /** @example 350574998400000 */
                tokens_per_period: string;
            };
            /** @example 1 */
            protocol_version: number;
            /** @example fabric_stp */
            provider_name?: string;
            tiers?: components["schemas"]["SubscriptionTier"][];
            token: {
                /** @example null */
                address: string | null;
                /** @example 18 */
                decimals: number;
                /** @example false */
                erc20: boolean;
                /** @example ETH */
                symbol: string;
            };
        };
        /** SubscriptionCheckResponse */
        SubscriptionCheckResponse: {
            [key: string]: {
                /** Format: int64 */
                expires_at: number | null;
                /** @enum {string} */
                object: "subscribed_to_dehydrated";
                status: boolean;
                /** Format: int64 */
                subscribed_at: number | null;
                tier: components["schemas"]["SubscriptionTier"] | null;
            };
        };
        /** SubscriptionTier */
        SubscriptionTier: {
            /** @example 1 */
            id?: number;
            price?: {
                /** @example 0 */
                initial_mint_price?: string;
                /** @example 2592000 */
                period_duration_seconds?: number;
                /** @example 3000000000000000 */
                tokens_per_period?: string;
            };
        };
        /** Subscriptions */
        Subscriptions: {
            subscriptions_created: components["schemas"]["Subscription"][];
        };
        /** SubscriptionsResponse */
        SubscriptionsResponse: {
            subscriptions_created?: components["schemas"]["Subscriptions"][];
        };
        /** TextRange */
        TextRange: {
            end: number;
            start: number;
        };
        /**
         * TokenBalance
         * @description The token balance associated with a wallet address and a network
         */
        TokenBalance: {
            balance: {
                /** @description The balance in the token */
                in_token: string;
                /** @description The balance in USDC */
                in_usdc: string;
            };
            /** @enum {string} */
            object: "token_balance";
            token: {
                /** @description The contract address of the token (omitted for native token) */
                address?: string;
                /** @description The number of decimals the token uses */
                decimals?: number;
                /** @description The token name e.g. "Ethereum" */
                name: string;
                /** @enum {string} */
                object: "token";
                /** @description The token symbol e.g. "ETH" */
                symbol: string;
            };
        };
        /**
         * TopLevelTopic
         * @description The top-level category the topic belongs to
         * @enum {string}
         */
        TopLevelTopic: "arts_culture" | "business_entrepreneurs" | "celebrity_pop_culture" | "diaries_daily_life" | "family" | "fashion_style" | "film_tv_video" | "fitness_health" | "food_dining" | "gaming" | "learning_educational" | "music" | "news_social_concern" | "other_hobbies" | "relationships" | "science_technology" | "sports" | "travel_adventure" | "youth_student_life";
        /** TransactionFrame */
        TransactionFrame: components["schemas"]["TransactionFramePay"];
        /**
         * TransactionFrameAction
         * @description Action button for primary CTA on the transaction mini app
         */
        TransactionFrameAction: {
            /**
             * @description Custom button color for action button
             * @example #000000
             */
            button_color?: string;
            /**
             * @description Custom text for action button
             * @example Pay
             */
            text?: string;
            /**
             * @description Custom text color for action button
             * @example #FFFFFF
             */
            text_color?: string;
        };
        /** TransactionFrameConfig */
        TransactionFrameConfig: {
            action?: components["schemas"]["TransactionFrameAction"];
            /** @description Optional list of FIDs that are allowed to use this transaction mini app */
            allowlist_fids?: components["schemas"]["Fid"][];
            /** @description List of items included in the transaction */
            line_items: components["schemas"]["TransactionFrameLineItem"][];
        };
        /** TransactionFrameDestination */
        TransactionFrameDestination: {
            address: components["schemas"]["EthAddress"];
            /**
             * @description Amount to send (must be greater than 0)
             * @example 0.01
             */
            amount: number;
            network: components["schemas"]["Network"];
            /**
             * @description Token contract address for the payment (e.g. 0x833589fcd6edb6e08f4c7c32d4f71b54bda02913 is USDC on Base)
             * @example 0x833589fcd6edb6e08f4c7c32d4f71b54bda02913
             */
            token_contract_address: string;
        };
        /** TransactionFrameLineItem */
        TransactionFrameLineItem: {
            /**
             * @description Description of the line item in transaction
             * @example Payment for goods
             */
            description: string;
            /**
             * @description Optional image URL for the line item in transaction
             * @example https://i.imgur.com/ovGo3sz.png
             */
            image?: string;
            /**
             * @description Name of the line item in transaction
             * @example Payment
             */
            name: string;
        };
        /** TransactionFramePay */
        TransactionFramePay: {
            config: components["schemas"]["TransactionFrameConfig"];
            /** @description Unique identifier for the transaction mini app */
            id: string;
            status: components["schemas"]["TransactionFrameStatus"];
            transaction: {
                to: components["schemas"]["TransactionFrameDestination"];
            };
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "pay";
            /**
             * Format: uri
             * @description URL that can be used to access the transaction mini app
             */
            url: string;
        };
        /** TransactionFrameResponse */
        TransactionFrameResponse: {
            transaction_frame: components["schemas"]["TransactionFrame"];
        };
        /**
         * TransactionFrameStatus
         * @enum {string}
         */
        TransactionFrameStatus: "created" | "completed";
        /**
         * TransactionFrameType
         * @description Type of transaction mini app
         * @enum {string}
         */
        TransactionFrameType: "pay";
        /** TransactionSendFungiblesReceipt */
        TransactionSendFungiblesReceipt: {
            amount: number;
            fid: components["schemas"]["Fid"];
            /** @description Reason for failure (if status is failed) */
            reason?: string;
            /** @enum {string} */
            status: "sent" | "failed";
        };
        /** TransactionSendFungiblesRecipient */
        TransactionSendFungiblesRecipient: {
            /** @description Amount to send (must be greater than 0) */
            amount: number;
            fid: components["schemas"]["Fid"];
        };
        /** TransactionSendFungiblesReqBody */
        TransactionSendFungiblesReqBody: {
            /**
             * @description Contract address of the fungible token to send. If not provided, the default is the native token of the network.
             * @example 0x833589fcd6edb6e08f4c7c32d4f71b54bda02913
             */
            fungible_contract_address?: string;
            /** @enum {string} */
            network: "base" | "optimism" | "base-sepolia";
            recipients: components["schemas"]["TransactionSendFungiblesRecipient"][];
        };
        /** TransactionSendFungiblesResponse */
        TransactionSendFungiblesResponse: {
            send_receipts: components["schemas"]["TransactionSendFungiblesReceipt"][];
            transactions: components["schemas"]["TransactionSendTxInfo"][];
        };
        /** TransactionSendTxInfo */
        TransactionSendTxInfo: {
            /** @description Hash of the transaction that approved the transfer. This is only present if the fungible token is not native token of the network. */
            approval_hash: string;
            /** @description Gas used for the transaction. */
            gas_used: string;
            /** @enum {string} */
            network: "base" | "optimism" | "base-sepolia";
            transaction_hash: string;
        };
        /** TrendingChannelResponse */
        TrendingChannelResponse: {
            channels: components["schemas"]["ChannelActivity"][];
            next: components["schemas"]["NextCursor"];
        };
        /** TrendingTopic */
        TrendingTopic: {
            /** @description Up to five recent Farcaster users who posted about the topic */
            authors: components["schemas"]["UserDehydrated"][];
            /** @description The display name of the topic */
            name: string;
            /** @description A URL-friendly unique identifier for the topic */
            slug: string;
            /** @description Short summary of the topic if available */
            summary: string | null;
            top_level_topic: components["schemas"]["TopLevelTopic"];
        };
        /** TrendingTopicsResponse */
        TrendingTopicsResponse: {
            next: components["schemas"]["NextCursor"];
            topics: components["schemas"]["TrendingTopic"][];
        };
        /** UpdateUserReqBody */
        UpdateUserReqBody: {
            /** @description Requires pro subscription. */
            banner?: string;
            bio?: string;
            display_name?: string;
            location?: {
                /** Format: double */
                latitude: number;
                /** Format: double */
                longitude: number;
            };
            pfp_url?: string;
            /**
             * @description Must be one of the verified addresses.
             * @example 0x5a927ac639636e534b678e81768ca19e2c6280b7
             */
            primary_eth_address?: string;
            /** @description Must be one of the verified addresses. */
            primary_sol_address?: string;
            signer_uuid: components["schemas"]["SignerUUID"];
            url?: string;
            username?: string;
            verified_accounts?: {
                github?: string;
                x?: string;
            };
        };
        /** User */
        User: {
            auth_addresses: {
                address: components["schemas"]["EthAddress"];
                app: components["schemas"]["UserDehydrated"];
            }[];
            custody_address: components["schemas"]["EthAddress"];
            display_name?: string | null;
            experimental?: {
                deprecation_notice?: string;
                /**
                 * Format: double
                 * @description Score that represents the probability that the account is not spam.
                 */
                neynar_user_score: number;
            };
            fid: components["schemas"]["Fid"];
            /**
             * Format: int32
             * @description The number of followers the user has.
             */
            follower_count: number;
            /**
             * Format: int32
             * @description The number of users the user is following.
             */
            following_count: number;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            object: "user";
            /** @description The URL of the user's profile picture */
            pfp_url?: string | null;
            pro?: {
                /** Format: date-time */
                expires_at: string;
                /**
                 * @description The subscription status of the user
                 * @enum {string}
                 */
                status: "subscribed" | "unsubscribed";
                /** Format: date-time */
                subscribed_at: string;
            };
            profile: {
                banner?: {
                    /**
                     * Format: uri
                     * @description The URL of the user's banner image
                     */
                    url?: string;
                };
                bio: {
                    mentioned_channels?: components["schemas"]["ChannelDehydrated"][];
                    /**
                     * @description Positions within the text (inclusive start, exclusive end) where each mention occurs.
                     *     Each index within this list corresponds to the same-numbered index in the mentioned_channels list.
                     */
                    mentioned_channels_ranges?: components["schemas"]["TextRange"][];
                    mentioned_profiles?: components["schemas"]["UserDehydrated"][];
                    /**
                     * @description Positions within the text (inclusive start, exclusive end) where each mention occurs.
                     *     Each index within this list corresponds to the same-numbered index in the mentioned_profiles list.
                     */
                    mentioned_profiles_ranges?: components["schemas"]["TextRange"][];
                    text: string;
                };
                live_at?: {
                    is_live: boolean;
                    /** Format: date-time */
                    updated_at: string;
                    /** @description The URL of the user's current live activity */
                    url: string;
                };
                location?: components["schemas"]["Location"];
            };
            /** Format: date-time */
            registered_at: string;
            /**
             * Format: double
             * @description Score that represents the probability that the account is not spam.
             */
            score?: number;
            username: string;
            verifications: components["schemas"]["EthAddress"][];
            verified_accounts: {
                /** @enum {string} */
                platform?: "x" | "github";
                username?: string;
            }[];
            verified_addresses: {
                /** @description List of verified Ethereum addresses of the user sorted by oldest to most recent. */
                eth_addresses: components["schemas"]["EthAddress"][];
                primary: {
                    eth_address: components["schemas"]["EthAddress"] | null;
                    sol_address: components["schemas"]["SolAddress"] | null;
                };
                /** @description List of verified Solana addresses of the user sorted by oldest to most recent. */
                sol_addresses: components["schemas"]["SolAddress"][];
            };
            viewer_context?: components["schemas"]["UserViewerContext"];
        };
        /** UserDehydrated */
        UserDehydrated: {
            custody_address?: components["schemas"]["EthAddress"];
            display_name?: string | null;
            fid: components["schemas"]["Fid"];
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            object: "user_dehydrated";
            pfp_url?: string | null;
            score?: number;
            username?: string;
        };
        /** UserFIDResponse */
        UserFIDResponse: {
            fid: components["schemas"]["Fid"];
        };
        /** UserPowerLiteResponse */
        UserPowerLiteResponse: {
            result: {
                /** @description List of FIDs */
                fids: components["schemas"]["Fid"][];
            };
        };
        /** UserResponse */
        UserResponse: {
            user: components["schemas"]["User"];
        };
        /** UserSearchResponse */
        UserSearchResponse: {
            result: {
                next?: components["schemas"]["NextCursor"];
                users: components["schemas"]["User"][];
            };
        };
        /**
         * UserViewerContext
         * @description Adds context on the viewer's follow relationship with the user.
         */
        UserViewerContext: {
            /** @description Indicates if the viewer is blocked by the user. */
            blocked_by: boolean;
            /** @description Indicates if the viewer is blocking the user. */
            blocking: boolean;
            /** @description Indicates if the viewer is followed by the user. */
            followed_by: boolean;
            /** @description Indicates if the viewer is following the user. */
            following: boolean;
        };
        /** UsersActiveChannelsResponse */
        UsersActiveChannelsResponse: {
            channels?: components["schemas"]["Channel"][];
            next?: components["schemas"]["NextCursor"];
        };
        /** UsersResponse */
        UsersResponse: {
            next: components["schemas"]["NextCursor"];
            users: components["schemas"]["User"][];
        };
        /**
         * Verification
         * @description Verification details of an address
         */
        Verification: {
            /**
             * @description Address string (hex for ethereum, base58 for solana)
             * @example 0x5a927ac639636e534b678e81768ca19e2c6280b7
             */
            address: string;
            app?: components["schemas"]["UserDehydrated"];
            /** @enum {string} */
            object: "verification";
            protocol: components["schemas"]["Protocol"];
            /**
             * @description ISO timestamp when the verification was created
             * @example 2024-01-01T00:00:00.000Z
             */
            verified_at: string;
        };
        /**
         * VerificationChainId
         * Format: int32
         * @description Chain ID for farcaster verifications. 0 for EOA verifications, 1 or 10 for contract verifications
         * @default 0
         */
        VerificationChainId: number | 0 | 1 | 10;
        /**
         * VerificationType
         * Format: int32
         * @description Type of verification. 0 = EOA, 1 = contract
         * @default 0
         */
        VerificationType: number | 0 | 1;
        /** VideoObject */
        VideoObject: {
            height?: string;
            type?: string;
            url: string;
            width?: string;
        };
        /** Webhook */
        Webhook: {
            active: boolean;
            /** Format: date-time */
            created_at: string;
            /** Format: date-time */
            deleted_at: string | null;
            description: string;
            developer_uuid: string;
            http_timeout: string;
            /** @enum {string} */
            object: "webhook";
            rate_limit: number;
            rate_limit_duration: string;
            secrets: components["schemas"]["WebhookSecret"][];
            subscription?: components["schemas"]["WebhookSubscription"];
            target_url: string;
            title: string;
            /** Format: date-time */
            updated_at: string;
            webhook_id: string;
        };
        /** WebhookDeleteReqBody */
        WebhookDeleteReqBody: {
            webhook_id: string;
        };
        /** WebhookListResponse */
        WebhookListResponse: {
            webhooks: components["schemas"]["Webhook"][];
        };
        /** WebhookPatchReqBody */
        WebhookPatchReqBody: {
            /** @enum {string} */
            active: "true" | "false";
            webhook_id: string;
        };
        /** WebhookPostReqBody */
        WebhookPostReqBody: {
            name: string;
            subscription?: components["schemas"]["WebhookSubscriptionFilters"];
            url: string;
        };
        /** WebhookPutReqBody */
        WebhookPutReqBody: {
            name: string;
            subscription?: components["schemas"]["WebhookSubscriptionFilters"];
            url: string;
            webhook_id: string;
        };
        /** WebhookResponse */
        WebhookResponse: {
            message?: string;
            success?: boolean;
            webhook?: components["schemas"]["Webhook"];
        };
        /** WebhookSecret */
        WebhookSecret: {
            created_at: string;
            deleted_at: string | null;
            expires_at: string;
            uid: string;
            updated_at: string;
            value: string;
        };
        /** WebhookSubscription */
        WebhookSubscription: {
            /** Format: date-time */
            created_at: string;
            filters: components["schemas"]["WebhookSubscriptionFilters"];
            /** @enum {string} */
            object: "webhook_subscription";
            subscription_id: string;
            /** Format: date-time */
            updated_at: string;
        };
        /** WebhookSubscriptionFilters */
        WebhookSubscriptionFilters: {
            "cast.created"?: components["schemas"]["WebhookSubscriptionFiltersCast"];
            "cast.deleted"?: components["schemas"]["WebhookSubscriptionFiltersCast"];
            "follow.created"?: components["schemas"]["WebhookSubscriptionFiltersFollow"];
            "follow.deleted"?: components["schemas"]["WebhookSubscriptionFiltersFollow"];
            "reaction.created"?: components["schemas"]["WebhookSubscriptionFiltersReaction"];
            "reaction.deleted"?: components["schemas"]["WebhookSubscriptionFiltersReaction"];
            "trade.created"?: components["schemas"]["WebhookSubscriptionFiltersTrade"];
            "user.created"?: Record<string, never>;
            "user.updated"?: {
                fids?: number[];
            };
        };
        /** WebhookSubscriptionFiltersCast */
        WebhookSubscriptionFiltersCast: {
            author_fids?: number[];
            /** @description Filter for casts that contain embedded casts authored by these FIDs */
            embedded_cast_author_fids?: number[];
            /** @description Filter for casts that quote/embed these specific cast hashes */
            embedded_cast_hashes?: string[];
            /**
             * @description Regex pattern to match the embeded_url (key embeds) of the cast.
             *     **Note:**
             *     1) Regex must be parsed by Go's RE2 engine (Test your expression here: https://www.lddgo.net/en/string/golangregex)
             *     2) Use backslashes to escape special characters.
             *     For example: \\b(farcaster|neynar)\\b should be written as \\\\b(farcaster|neynar)\\\\b
             * @example (farcaster|neynar)
             */
            embeds?: string;
            /**
             * @description Exclude casts that matches these authors.
             *     **Note:**
             *     This is applied as an AND operation against rest of the filters.
             *     Rest of the filters are bundled as an OR operation.
             */
            exclude_author_fids?: number[];
            mentioned_fids?: number[];
            /** @default 0 */
            minimum_author_score: number;
            parent_author_fids?: number[];
            parent_hashes?: string[];
            parent_urls?: string[];
            root_parent_urls?: string[];
            /**
             * @description Regex pattern to match the text key of the cast.
             *     **Note:**
             *     1) Regex must be parsed by Go's RE2 engine (Test your expression here: https://www.lddgo.net/en/string/golangregex)
             *     2) Use backslashes to escape special characters.
             *     For example: (?i)\\$degen should be written as (?i)\\\\$degen
             * @example (?i)\$degen
             */
            text?: string;
        };
        /** WebhookSubscriptionFiltersFollow */
        WebhookSubscriptionFiltersFollow: {
            fids?: number[];
            target_fids?: number[];
        };
        /** WebhookSubscriptionFiltersReaction */
        WebhookSubscriptionFiltersReaction: {
            fids?: number[];
            target_cast_hashes?: string[];
            target_fids?: number[];
        };
        /** WebhookSubscriptionFiltersTrade */
        WebhookSubscriptionFiltersTrade: {
            fids?: number[];
            minimum_token_amount_usdc?: number;
            minimum_trader_neynar_score?: number;
        };
        /** ZodError */
        ZodError: {
            /** @example InvalidField */
            code: string;
            errors: {
                code: string;
                expected: string;
                message: string;
                path: string[];
                received: string;
            }[];
            /** @example Invalid query parameters */
            message: string;
        };
    };
    responses: never;
    parameters: {
        /** @description Optional Bearer token for certain endpoints. The token format is described [here](https://docs.farcaster.xyz/reference/warpcast/api#authentication). */
        AuthorizationHeader: string;
        /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
        NeynarExperimentalHeader: boolean;
        /** @description Wallet ID to use for transactions */
        WalletIdHeader: string;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    billing: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        billing_email: string | null;
                        effective_plan: string;
                        has_active_subscription: boolean;
                        is_trialing: boolean;
                        organization_name: string;
                        organization_status: string | null;
                        plan_tier: string | null;
                        product_category: string | null;
                        product_name: string | null;
                        stripe_customer_id: string | null;
                        stripe_product_id: string | null;
                        stripe_subscription_id: string | null;
                        /** Format: date-time */
                        subscription_end: string | null;
                        /** Format: date-time */
                        subscription_start: string | null;
                        subscription_status: string | null;
                        workos_organization_id: string;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code: string;
                        message: string;
                    };
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code: string;
                        message: string;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code: string;
                        message: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code: string;
                        message: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code: string;
                        message: string;
                    };
                };
            };
        };
    };
    upgrade: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    newPlan: string;
                    /** @enum {string} */
                    productCategory?: "API" | "STUDIO";
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        chargeAmount: number;
                        creditApplied: number;
                        effectiveImmediately: boolean;
                        newPlan: string;
                        success: boolean;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code: string;
                        message: string;
                        paymentMethod?: {
                            brand: string;
                            last4: string;
                        };
                    };
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code: string;
                        message: string;
                        paymentMethod?: {
                            brand: string;
                            last4: string;
                        };
                    };
                };
            };
            /** @description Payment Required */
            402: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code: string;
                        message: string;
                        paymentMethod?: {
                            brand: string;
                            last4: string;
                        };
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code: string;
                        message: string;
                        paymentMethod?: {
                            brand: string;
                            last4: string;
                        };
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code: string;
                        message: string;
                        paymentMethod?: {
                            brand: string;
                            last4: string;
                        };
                    };
                };
            };
        };
    };
    "upgrade-preview": {
        parameters: {
            query: {
                newPlan: string;
                productCategory?: "API" | "STUDIO";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        billingDateUnchanged: boolean;
                        chargeAmount: number;
                        credit: {
                            creditAmount: number;
                            unitRate: number;
                            unusedUnits: number;
                        };
                        currentPlan: {
                            computeUnitsLimit: number;
                            computeUnitsUsed: number;
                            name: string;
                            price: number;
                        };
                        newPlan: {
                            computeUnitsLimit: number;
                            name: string;
                            price: number;
                        };
                        usageCarriesOver: boolean;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code: string;
                        message: string;
                        paymentMethod?: {
                            brand: string;
                            last4: string;
                        };
                    };
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code: string;
                        message: string;
                        paymentMethod?: {
                            brand: string;
                            last4: string;
                        };
                    };
                };
            };
            /** @description Payment Required */
            402: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code: string;
                        message: string;
                        paymentMethod?: {
                            brand: string;
                            last4: string;
                        };
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code: string;
                        message: string;
                        paymentMethod?: {
                            brand: string;
                            last4: string;
                        };
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code: string;
                        message: string;
                        paymentMethod?: {
                            brand: string;
                            last4: string;
                        };
                    };
                };
            };
        };
    };
    "publish-farcaster-action": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FarcasterActionReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: unknown;
                    };
                };
            };
        };
    };
    "app-host-get-event": {
        parameters: {
            query: {
                /** @description The domain of the mini app */
                app_domain: string;
                /** @description The FID of the user who initiated the event */
                fid: number;
                /** @description The type of event */
                event: "frame_added" | "frame_removed" | "notifications_enabled" | "notifications_disabled";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppHostGetEventResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "app-host-post-event": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AppHostPostEventReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppHostPostEventResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "app-host-get-user-state": {
        parameters: {
            query: {
                /** @description The FID of the user */
                fid: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppHostUserStateResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "lookup-developer-managed-auth-address": {
        parameters: {
            query: {
                /** @description Ethereum address */
                address: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        address: components["schemas"]["EthAddress"];
                        /** Format: uri */
                        auth_address_approval_url?: string;
                        fid?: components["schemas"]["Fid"];
                        /** @enum {string} */
                        status: "pending_approval" | "approved" | "revoked";
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "register-signed-key-for-developer-managed-auth-address": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegisterAuthAddressDeveloperManagedSignedKeyReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        address: components["schemas"]["EthAddress"];
                        /** Format: uri */
                        auth_address_approval_url?: string;
                        fid?: components["schemas"]["Fid"];
                        /** @enum {string} */
                        status: "pending_approval" | "approved" | "revoked";
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "publish-bans": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BanReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BanResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "delete-bans": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BanReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BanResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-ban-list": {
        parameters: {
            query?: {
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BanListResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "publish-block": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BlockReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OperationResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "delete-block": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BlockReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OperationResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-block-list": {
        parameters: {
            query?: {
                /** @description Providing this will return the users that this user has blocked */
                blocker_fid?: number;
                /** @description Providing this will return the users that have blocked this user */
                blocked_fid?: number;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BlockListResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "lookup-cast-by-hash-or-url": {
        parameters: {
            query: {
                /** @description Cast identifier (It's either a URL or a hash) */
                identifier: string;
                /**
                 * @description The query param accepted by the API. Sent along with identifier param.
                 *     url - Cast identifier is a url
                 *     hash - Cast identifier is a hash
                 */
                type: "url" | "hash";
                /** @description adds viewer_context to cast object to show whether viewer has liked or recasted the cast. */
                viewer_fid?: number;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CastResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "publish-cast": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PostCastReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PostCastResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "delete-cast": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DeleteCastReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OperationResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "lookup-cast-conversation": {
        parameters: {
            query: {
                /** @description Cast identifier (It's either a URL or a hash) */
                identifier: string;
                /**
                 * @description The query param accepted by the API. Sent along with identifier param.
                 *     url - Cast identifier is a url
                 *     hash - Cast identifier is a hash
                 */
                type: "url" | "hash";
                /** @description The depth of replies in the conversation that will be returned (default 2) */
                reply_depth?: number;
                /** @description Include all parent casts in chronological order */
                include_chronological_parent_casts?: boolean;
                /** @description Providing this will return a conversation that respects this user's mutes and blocks and includes `viewer_context`. */
                viewer_fid?: number;
                /** @description Sort type for the ordering of descendants. Default is `chron` */
                sort_type?: "chron" | "desc_chron" | "algorithmic";
                /** @description Show conversation above or below the fold. Lower quality responses are hidden below the fold. Not passing in a value shows the full conversation without any folding. */
                fold?: "above" | "below";
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Conversation"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "lookup-cast-conversation-summary": {
        parameters: {
            query: {
                /** @description Cast identifier (It's either a URL or a hash)) */
                identifier: string;
                /** @description Number of casts to consider in a summary up to a point of target cast */
                limit?: number;
                /** @description Additional prompt used to generate a summary */
                prompt?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConversationSummary"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-embedded-url-metadata": {
        parameters: {
            query: {
                /** @description URL to crawl metadata of */
                url: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CastEmbedCrawlResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-cast-metrics": {
        parameters: {
            query: {
                /** @description Query string to search for casts */
                q: string;
                /** @description Interval of time for which to fetch metrics. Default is 30d. */
                interval?: "1d" | "7d" | "30d" | "90d" | "180d";
                /** @description Fid of the user whose casts you want to search */
                author_fid?: number;
                /** @description Channel ID of the casts you want to search */
                channel_id?: string;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CastsMetricsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-cast-quotes": {
        parameters: {
            query: {
                /** @description Cast identifier (It's either a URL or a hash) */
                identifier: string;
                /**
                 * @description The query param accepted by the API. Sent along with identifier param.
                 *     url - Cast identifier is a url
                 *     hash - Cast identifier is a hash
                 */
                type: "url" | "hash";
                viewer_fid?: number;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        casts: components["schemas"]["Cast"][];
                        next: components["schemas"]["NextCursor"];
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "search-casts": {
        parameters: {
            query: {
                /**
                 * @description Query string to search for casts. Supported operators:
                 *
                 *     | Operator  | Description                                                                                              |
                 *     | --------- | -------------------------------------------------------------------------------------------------------- |
                 *     | `+`       | Acts as the AND operator. This is the default operator between terms and can usually be omitted.         |
                 *     | `\|`      | Acts as the OR operator.                                                                                 |
                 *     | `*`       | When used at the end of a term, signifies a prefix query.                                                  |
                 *     | `"`       | Wraps several terms into a phrase (for example, `"star wars"`).                                          |
                 *     | `(`, `)`  | Wrap a clause for precedence (for example, `star + (wars \| trek)`).                                     |
                 *     | `~n`      | When used after a term (for example, `satr~3`), sets `fuzziness`. When used after a phrase, sets `slop`. |
                 *     | `-`       | Negates the term.                                                                                        |
                 *     | `before:` | Search for casts before a specific date. (e.g. `before:2025-04-20` or `before:2025-04-20T23:59:59`)      |
                 *     | `after:`  | Search for casts after a specific date. (e.g. `after:2025-04-20` or `after:2025-04-20T00:00:00`)         |
                 */
                q: string;
                /**
                 * @description Choices are:
                 *     - `literal` - Searches for the words in the query string (default)
                 *     - `semantic` - Searches for the meaning of the query string
                 *     - `hybrid` - Combines both literal and semantic results
                 */
                mode?: "literal" | "semantic" | "hybrid";
                /**
                 * @description Choices are:
                 *     - `desc_chron` - All casts sorted by time in a descending order (default)
                 *     - `chron` - All casts sorted by time in ascending order
                 *     - `algorithmic` - Casts sorted by engagement and time
                 */
                sort_type?: "desc_chron" | "chron" | "algorithmic";
                /** @description Fid of the user whose casts you want to search */
                author_fid?: number;
                /** @description Providing this will return search results that respects this user's mutes and blocks and includes `viewer_context`. */
                viewer_fid?: number;
                /** @description Parent URL of the casts you want to search */
                parent_url?: string;
                /** @description Channel ID of the casts you want to search */
                channel_id?: string;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor */
                cursor?: string;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CastsSearchResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-bulk-casts": {
        parameters: {
            query: {
                /** @description Hashes of the cast to be retrived (Comma separated, no spaces) */
                casts: string;
                /** @description adds viewer_context to cast object to show whether viewer has liked or recasted the cast. */
                viewer_fid?: number;
                /** @description Optional parameter to sort the casts based on different criteria */
                sort_type?: "trending" | "likes" | "recasts" | "replies" | "recent";
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CastsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "lookup-channel": {
        parameters: {
            query: {
                /** @description Channel ID for the channel being queried */
                id: string;
                /** @description Type of identifier being used to query the channel. Defaults to ID. */
                type?: "id" | "parent_url";
                /** @description FID of the user viewing the channel. */
                viewer_fid?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChannelResponse"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-bulk-channels": {
        parameters: {
            query: {
                /** @description Comma separated list of channel IDs or parent_urls, up to 100 at a time */
                ids: string;
                /** @description Type of identifier being used to query the channels. Defaults to ID. */
                type?: "id" | "parent_url";
                /** @description FID of the user viewing the channels. */
                viewer_fid?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChannelResponseBulk"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "follow-channel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChannelFollowReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OperationResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "unfollow-channel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChannelFollowReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OperationResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Bad Gateway */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-followers-for-a-channel": {
        parameters: {
            query: {
                /** @description Channel ID for the channel being queried */
                id: string;
                /** @description Providing this will return a list of followers that respects this user's mutes and blocks and includes `viewer_context`. */
                viewer_fid?: number;
                /** @description Pagination cursor. */
                cursor?: string;
                /** @description Number of followers to fetch */
                limit?: number;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UsersResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-relevant-followers-for-a-channel": {
        parameters: {
            query: {
                /** @description Channel ID being queried */
                id: string;
                /** @description The FID of the user to customize this response for. Providing this will also return a list of followers that respects this user's mutes and blocks and includes `viewer_context`. */
                viewer_fid: number;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RelevantFollowersResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-all-channels": {
        parameters: {
            query?: {
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChannelListResponse"];
                };
            };
        };
    };
    "remove-channel-member": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemoveChannelMemberReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OperationResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "respond-channel-invite": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RespondChannelInviteReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OperationResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "invite-channel-member": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["InviteChannelMemberReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OperationResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-channel-invites": {
        parameters: {
            query?: {
                /** @description Channel ID for the channel being queried */
                channel_id?: string;
                /** @description FID of the user being invited */
                invited_fid?: number;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChannelMemberInviteListResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-channel-members": {
        parameters: {
            query: {
                /** @description Channel ID for the channel being queried */
                channel_id: string;
                /** @description FID of the user being queried. Specify this to check if a user is a member of the channel without paginating through all members. */
                fid?: number;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChannelMemberListResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "search-channels": {
        parameters: {
            query: {
                /** @description Channel ID or name for the channel being queried */
                q: string;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
                /** @description FID of the user viewing the channels. */
                viewer_fid?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChannelSearchResponse"];
                };
            };
        };
    };
    "fetch-trending-channels": {
        parameters: {
            query?: {
                time_window?: "1d" | "7d" | "30d";
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TrendingChannelResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-users-active-channels": {
        parameters: {
            query: {
                /** @description The user's FID (identifier) */
                fid: number;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UsersActiveChannelsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-feed": {
        parameters: {
            query?: {
                /** @description Defaults to following (requires FID or address). If set to filter (requires filter_type) */
                feed_type?: "following" | "filter";
                /** @description Used when feed_type=filter. Options include fids (requires fids), parent_url (requires parent_url), channel_id (requires channel_id), embed_url (requires embed_url), embed_types (requires embed_types), or global_trending. */
                filter_type?: "fids" | "parent_url" | "channel_id" | "embed_url" | "embed_types" | "global_trending";
                /** @description (Optional) FID of user whose feed you want to create. By default, the API expects this field, except if you pass a filter_type */
                fid?: number;
                /** @description Used when filter_type=FIDs . Create a feed based on a list of FIDs. Max array size is 100. Requires feed_type and filter_type. */
                fids?: string;
                /** @description Used when filter_type=parent_url can be used to fetch content under any parent url e.g. FIP-2 channels on Warpcast. Requires feed_type and filter_type. */
                parent_url?: string;
                /** @description Used when filter_type=channel_id can be used to fetch casts under a channel. Requires feed_type and filter_type. */
                channel_id?: string;
                /** @description Used when filter_type=channel_id. Only include casts from members of the channel. True by default. */
                members_only?: boolean;
                /** @description Used when filter_type=embed_url. Casts with embedded URLs prefixed by this embed_url param will be returned. We normalize your given URL prefix and prepend 'https://' if no protocol is included. Requires feed_type and filter_type. */
                embed_url?: string;
                /** @description Used when filter_type=embed_types can be used to fetch all casts with matching content types. Requires feed_type and filter_type. */
                embed_types?: ("text" | "image" | "video" | "audio" | "text/html" | "text/plain" | "image/jpeg" | "image/png" | "image/gif" | "image/webp" | "image/svg+xml" | "image/heif" | "video/mp4" | "video/quicktime" | "audio/mpeg" | "application/pdf" | "application/json" | "application/x-mpegurl")[];
                /** @description Include recasts in the response, true by default */
                with_recasts?: boolean;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
                /** @description Providing this will return a feed that respects this user's mutes and blocks and includes `viewer_context`. */
                viewer_fid?: number;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeedResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-feed-by-channel-ids": {
        parameters: {
            query: {
                /** @description Comma separated list of up to 10 channel IDs e.g. neynar,farcaster */
                channel_ids: string;
                /** @description Include recasts in the response, true by default */
                with_recasts?: boolean;
                /** @description Providing this will return a feed that respects this user's mutes and blocks and includes `viewer_context`. */
                viewer_fid?: number;
                /** @description Include replies in the response, false by default */
                with_replies?: boolean;
                /** @description Used when filter_type=channel_id. Only include casts from members of the channel. True by default. */
                members_only?: boolean;
                /** @description Comma separated list of FIDs to filter the feed by, up to 10 at a time */
                fids?: string;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
                /** @description If true, only casts that have been liked by the moderator (if one exists) will be returned. */
                should_moderate?: boolean;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeedResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-user-following-feed": {
        parameters: {
            query: {
                /** @description FID of user whose feed you want to create */
                fid: number;
                /** @description Providing this will return a feed that respects this user's mutes and blocks and includes `viewer_context`. */
                viewer_fid?: number;
                /** @description Include recasts in the response, true by default */
                with_recasts?: boolean;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeedResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-feed-for-you": {
        parameters: {
            query: {
                /** @description FID of user whose feed you want to create */
                fid: number;
                /** @description Providing this will return a feed that respects this user's mutes and blocks and includes `viewer_context`. */
                viewer_fid?: number;
                /** @description The provider of the For You feed. */
                provider?: "neynar";
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeedResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ZodError"] | components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-feed-by-parent-urls": {
        parameters: {
            query: {
                /** @description Comma separated list of parent_urls */
                parent_urls: string;
                /** @description Include recasts in the response, true by default */
                with_recasts?: boolean;
                /** @description Providing this will return a feed that respects this user's mutes and blocks and includes `viewer_context`. */
                viewer_fid?: number;
                /** @description Include replies in the response, false by default */
                with_replies?: boolean;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeedResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-feed-by-topic": {
        parameters: {
            query: {
                /** @description Topic slug to filter casts by. Must be lowercase and contain only alphanumeric characters and underscores. */
                slug: string;
                /** @description Include recasts in the response, true by default. */
                with_recasts?: boolean;
                /** @description Providing this will return a feed that respects this user's mutes and blocks and includes `viewer_context`. */
                viewer_fid?: number;
                /** @description Number of results to fetch. */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeedResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-trending-feed": {
        parameters: {
            query?: {
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor */
                cursor?: string;
                /** @description Providing this will return a feed that respects this user's mutes and blocks and includes `viewer_context`. */
                viewer_fid?: number;
                /** @description Time window for trending casts (7d window for channel feeds only) */
                time_window?: "1h" | "6h" | "12h" | "24h" | "7d";
                /** @description Channel ID to filter trending casts. Less active channels might have no casts in the time window selected. Provide either `channel_id` or `parent_url`, not both. */
                channel_id?: string;
                /** @description Parent URL to filter trending casts. Less active channels might have no casts in the time window selected. Provide either `channel_id` or `parent_url`, not both. */
                parent_url?: string;
                /** @description The provider of the trending casts feed. */
                provider?: "neynar";
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeedResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ZodError"] | components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-casts-for-user": {
        parameters: {
            query: {
                /** @description FID of user whose recent casts you want to fetch */
                fid: number;
                /** @description Optionally filter to casts created via a specific app FID, e.g. 9152 for Warpcast */
                app_fid?: number;
                /** @description FID of the user viewing the feed */
                viewer_fid?: number;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor */
                cursor?: string;
                /** @description Include reply casts by the author in the response, true by default */
                include_replies?: boolean;
                /** @description Parent URL to filter the feed; mutually exclusive with channel_id */
                parent_url?: string;
                /** @description Channel ID to filter the feed; mutually exclusive with parent_url */
                channel_id?: string;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeedResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-popular-casts-by-user": {
        parameters: {
            query: {
                /** @description FID of user whose feed you want to create */
                fid: number;
                viewer_fid?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BulkCastsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-replies-and-recasts-for-user": {
        parameters: {
            query: {
                /** @description FID of user whose replies and recasts you want to fetch */
                fid: number;
                /** @description Filter to fetch only replies or recasts */
                filter?: "replies" | "recasts" | "all";
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
                /** @description Providing this will return a feed that respects this user's mutes and blocks and includes `viewer_context`. */
                viewer_fid?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FeedResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "is-fname-available": {
        parameters: {
            query: {
                fname: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FnameAvailabilityResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-user-followers": {
        parameters: {
            query: {
                /** @description User who's profile you are looking at */
                fid: number;
                /** @description Providing this will return a list of followers that respects this user's mutes and blocks and includes `viewer_context`. */
                viewer_fid?: number;
                /** @description Sort type for fetch followers. Default is `desc_chron` */
                sort_type?: "desc_chron" | "algorithmic";
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FollowersResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-user-reciprocal-followers": {
        parameters: {
            query: {
                fid: number;
                viewer_fid?: number;
                limit?: number;
                /** @description Pagination cursor */
                cursor?: string;
                sort_type?: "desc_chron" | "algorithmic";
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        next: components["schemas"]["NextCursor"];
                        users: components["schemas"]["ReciprocalFollower"][];
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-relevant-followers": {
        parameters: {
            query: {
                /** @description User who's profile you are looking at */
                target_fid: number;
                /** @description The FID of the user to customize this response for. Providing this will also return a list of followers that respects this user's mutes and blocks and includes `viewer_context`. */
                viewer_fid: number;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RelevantFollowersResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-user-following": {
        parameters: {
            query: {
                /** @description FID of the user whose following you want to fetch. */
                fid: number;
                /** @description Providing this will return a list of users that respects this user's mutes and blocks and includes `viewer_context`. */
                viewer_fid?: number;
                /** @description Optional parameter to sort the users based on different criteria. */
                sort_type?: "desc_chron" | "algorithmic";
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FollowersResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-follow-suggestions": {
        parameters: {
            query: {
                /** @description FID of the user whose following you want to fetch. */
                fid: number;
                /** @description Providing this will return a list of users that respects this user's mutes and blocks and includes `viewer_context`. */
                viewer_fid?: number;
                /** @description Number of results to fetch */
                limit?: number;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UsersResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-frame-catalog": {
        parameters: {
            query?: {
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor */
                cursor?: string;
                /** @description Time window used to calculate the change in trending score for each mini app, used to sort mini app results */
                time_window?: "1h" | "6h" | "12h" | "24h" | "7d";
                /** @description Comma separated list of categories to include in the results. Includes all if left blank. Example: categories=games,social OR categories=games&categories=social */
                categories?: ("games" | "social" | "finance" | "utility" | "productivity" | "health-fitness" | "news-media" | "music" | "shopping" | "education" | "developer-tools" | "entertainment" | "art-creativity")[];
                /** @description List of blockchain networks by which to filter results.  Mini apps included in the results will specify at least one of the supplied networks or specify none. The list can be provided as comma-separated string or array. */
                networks?: ("ethereum" | "base" | "arbitrum" | "arbitrum-sepolia" | "base-sepolia" | "degen" | "gnosis" | "optimism" | "optimism-sepolia" | "polygon" | "ethereum-sepolia" | "zora" | "unichain" | "monad-testnet" | "celo" | "solana")[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FrameCatalogResponse"];
                };
            };
        };
    };
    "fetch-notification-tokens": {
        parameters: {
            query?: {
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Comma separated list of FIDs, up to 100 at a time. If you pass in FIDs, you will get back the notification tokens for those FIDs. If you don't pass in FIDs, you will get back all the notification tokens for the mini app. */
                fids?: string;
                /** @description Pagination cursor */
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FrameNotificationTokens"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "get-notification-campaign-stats": {
        parameters: {
            query?: {
                /** @description An ID of a specific notification campaign to query */
                campaign_id?: string;
                /** @description The number of results to return */
                limit?: number;
                /** @description Pagination cursor */
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        next: components["schemas"]["NextCursor"];
                        notificationCampaigns: components["schemas"]["NotificationCampaign"][];
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ZodError"] | components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "publish-frame-notifications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SendFrameNotificationsReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SendFrameNotificationsResponse"];
                };
            };
            /** @description 202 */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QueuedFrameNotificationsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ZodError"] | components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Unprocessable Content */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-relevant-frames": {
        parameters: {
            query: {
                /** @description FID of the user to fetch relevant mini apps for */
                viewer_fid: number;
                /** @description Time window used to limit statistics used to calculate mini app relevance */
                time_window?: "1h" | "6h" | "12h" | "24h" | "7d";
                /** @description List of blockchain networks by which to filter results.  Mini apps included in the results will specify at least one of the supplied networks or specify none. The list can be provided as comma-separated string or array. */
                networks?: ("ethereum" | "base" | "arbitrum" | "arbitrum-sepolia" | "base-sepolia" | "degen" | "gnosis" | "optimism" | "optimism-sepolia" | "polygon" | "ethereum-sepolia" | "zora" | "unichain" | "monad-testnet" | "celo" | "solana")[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        relevant_frames: {
                            /** @description FrameV2 object */
                            frame: {
                                author?: components["schemas"]["User"];
                                /** @description Launch URL of the mini app */
                                frames_url: string;
                                /** @description URL of the image */
                                image: string;
                                manifest?: components["schemas"]["FarcasterManifest"];
                                metadata?: {
                                    html: components["schemas"]["HtmlMetadata"];
                                };
                                /** @description Button title of a mini app */
                                title?: string;
                                /** @description Version of the mini app, 'next' for v2, 'vNext' for v1 */
                                version: string;
                            };
                            /** @description Array of remaining relevant users in dehydrated form */
                            remaining_relevant_users: components["schemas"]["UserDehydrated"][];
                            /** @description Array of the most relevant users */
                            top_relevant_users: components["schemas"]["User"][];
                        }[];
                    };
                };
            };
        };
    };
    "search-frames": {
        parameters: {
            query: {
                /** @description Query string to search for mini apps */
                q: string;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor */
                cursor?: string;
                /** @description List of blockchain networks by which to filter results.  Mini apps included in the results will specify at least one of the supplied networks or specify none. The list can be provided as comma-separated string or array. */
                networks?: ("ethereum" | "base" | "arbitrum" | "arbitrum-sepolia" | "base-sepolia" | "degen" | "gnosis" | "optimism" | "optimism-sepolia" | "polygon" | "ethereum-sepolia" | "zora" | "unichain" | "monad-testnet" | "celo" | "solana")[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FrameCatalogResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "get-transaction-pay-frame": {
        parameters: {
            query: {
                /** @description ID of the transaction mini app to retrieve */
                id: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TransactionFrameResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "create-transaction-pay-frame": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FramePayTransactionReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TransactionFrameResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-relevant-fungible-owners": {
        parameters: {
            query: {
                /** @description Contract address of the fungible asset */
                contract_address: string;
                /** @description Network of the fungible asset. */
                network: "ethereum" | "optimism" | "base" | "arbitrum";
                /** @description If you provide a viewer_fid, the response will include token holders from the user's network, respecting their mutes and blocks and including viewer_context; if not provided, the response will show top token holders across the network—both sets can be combined to generate a longer list if desired. */
                viewer_fid?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RelevantFungibleOwnersResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-bulk-relevant-fungible-owners": {
        parameters: {
            query: {
                /** @description Comma separated list of contract addresses, up to 10 at a time */
                contract_addresses: string;
                /** @description Network of the fungible assets. */
                network: "ethereum" | "optimism" | "base" | "arbitrum";
                /** @description If you provide a viewer_fid, the response will include token holders from the user's network, respecting their mutes and blocks and including viewer_context. */
                viewer_fid?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BulkRelevantFungibleOwnersResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "send-fungibles-to-users": {
        parameters: {
            query?: never;
            header: {
                /** @description Wallet ID to use for transactions */
                "x-wallet-id": components["parameters"]["WalletIdHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TransactionSendFungiblesReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TransactionSendFungiblesResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-fungible-trades": {
        parameters: {
            query: {
                network: "base";
                /** @description Contract address */
                address: string;
                /** @description Time window for trades e.g. "1h", "6h", "12h", "24h", "7d" */
                time_window?: "1h" | "6h" | "12h" | "24h" | "7d";
                /** @description Minimum USD amount to filter trades */
                min_amount_usd?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @enum {string} */
                        object: "fungible_trades";
                        trades: {
                            /** @enum {string} */
                            object: "trade";
                            pool?: {
                                address: string;
                                /** @enum {string} */
                                object: "pool";
                                protocol_family?: string;
                                protocol_version?: string;
                            };
                            trader: components["schemas"]["UserDehydrated"];
                            transaction: {
                                hash: string;
                                net_transfer: {
                                    /** @enum {string} */
                                    object: "net_transfer";
                                    receiving_fungible: components["schemas"]["FungibleBalance"];
                                    sending_fungible: components["schemas"]["FungibleBalance"];
                                };
                                network: {
                                    name: string;
                                    /** @enum {string} */
                                    object: "network";
                                };
                            };
                        }[];
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-trending-fungibles": {
        parameters: {
            query: {
                network: "base";
                /** @description Time window for trending calculations e.g. "1h", "6h", "12h", "24h", "7d" */
                time_window?: "1h" | "6h" | "12h" | "24h" | "7d";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        trending: {
                            fungible: {
                                /** @description The contract address of the token */
                                address: string;
                                /** @description The number of decimals the token uses */
                                decimals: number;
                                /** @description The logo URL of the token */
                                logo: string | null;
                                /** @description The token name e.g. "Ethereum" */
                                name: string;
                                network: components["schemas"]["Network"];
                                /** @enum {string} */
                                object: "fungible";
                                price?: {
                                    in_usd: string;
                                };
                                /** @description The token symbol e.g. "ETH" */
                                symbol: string;
                                /** @description The total supply of the token */
                                total_supply: string | null;
                            };
                            /** @enum {string} */
                            object: "trending_fungible";
                        }[];
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-fungibles": {
        parameters: {
            query: {
                /** @description Comma-separated fungible identifiers */
                fungibles: string;
                /** @description Optional FID of the viewer to personalize cast count filtering */
                viewer_fid?: number;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FungiblesResponseSchema"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-authorization-url": {
        parameters: {
            query: {
                client_id: string;
                response_type: "code";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthorizationUrlResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-nonce": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NonceResponse"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "publish-message-to-farcaster": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PublishMessageReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublishMessageResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "publish-mute": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MuteReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MuteResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "delete-mute": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MuteReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MuteResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-mute-list": {
        parameters: {
            query: {
                /** @description The user's FID (identifier) */
                fid: number;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MuteListResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "deploy-erc721": {
        parameters: {
            query?: never;
            header: {
                /** @description Wallet ID to use for transactions */
                "x-wallet-id": components["parameters"]["WalletIdHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    description?: string;
                    external_link?: string;
                    image?: string;
                    /**
                     * @description Max supply (0 = unlimited)
                     * @default 0
                     */
                    max_supply?: number;
                    mint_config?: {
                        /** @description Unix timestamp (defaults to no end date) */
                        end_timestamp?: number;
                        /**
                         * @description Max tokens per transaction (0 = unlimited)
                         * @default 0
                         */
                        max_per_tx?: number;
                        /**
                         * @description Max tokens per wallet (0 = unlimited)
                         * @default 0
                         */
                        max_per_wallet?: number;
                        /**
                         * @description Price per token in wei (0 = free mint)
                         * @default 0
                         */
                        price_per_token?: string;
                        /** @description Unix timestamp (defaults to current time) */
                        start_timestamp?: number;
                    };
                    name: string;
                    /** @enum {string} */
                    network: "base" | "optimism" | "base-sepolia";
                    /**
                     * @description Royalty in basis points (500 = 5%, max 2500 = 25%)
                     * @default 0
                     */
                    royalty_bps?: number;
                    /**
                     * @description Defaults to creator wallet
                     * @example 0x5a927ac639636e534b678e81768ca19e2c6280b7
                     */
                    royalty_recipient?: string;
                    symbol: string;
                };
            };
        };
        responses: {
            /** @description 201 */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        collection: {
                            address: components["schemas"]["EthAddress"];
                            name: string;
                            /** @enum {string} */
                            network: "base" | "optimism" | "base-sepolia";
                            symbol: string;
                            transaction_hash: string;
                            /** @enum {string} */
                            type: "ERC721";
                        };
                        /** @enum {string} */
                        object: "nft_collection";
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "generate-image": {
        parameters: {
            query?: never;
            header: {
                /** @description Wallet ID to use for transactions */
                "x-wallet-id": components["parameters"]["WalletIdHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Output image format (default: png)
                     * @default png
                     * @enum {string}
                     */
                    format?: "png" | "jpeg" | "webp";
                    /**
                     * @description Output image height in pixels (default: 1024)
                     * @default 1024
                     */
                    height?: number;
                    /**
                     * @description Use the high-fidelity model (slower but more detailed). Default: false.
                     * @default false
                     */
                    high_fidelity?: boolean;
                    /** @description Text prompt describing the image to generate */
                    prompt: string;
                    /** @description Optional array of source image URLs to edit or use as reference (max 5) */
                    source_image_urls?: string[];
                    /**
                     * @description Output image width in pixels (default: 1024)
                     * @default 1024
                     */
                    width?: number;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** Format: uri */
                        image_url: string;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "upload-token-metadata": {
        parameters: {
            query?: never;
            header: {
                /** @description Wallet ID to use for transactions */
                "x-wallet-id": components["parameters"]["WalletIdHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * EthAddress
                     * @description Ethereum address
                     * @example 0x5a927ac639636e534b678e81768ca19e2c6280b7
                     */
                    contract_address: string;
                    /** @enum {string} */
                    network: "base" | "optimism" | "base-sepolia";
                    tokens: {
                        metadata: {
                            animation_url?: string;
                            attributes?: {
                                /** @enum {string} */
                                display_type?: "number" | "boost_number" | "boost_percentage" | "date";
                                max_value?: number;
                                trait_type: string;
                                value: string | number;
                            }[];
                            background_color?: string;
                            description?: string;
                            external_url?: string;
                            image: string;
                            name: string;
                            youtube_url?: string;
                        };
                        token_id: string;
                    }[];
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        tokens: ({
                            token_id: string;
                            uri: string;
                        } | {
                            error: string;
                            token_id: string;
                        })[];
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ZodError"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "simulate-nft-mint": {
        parameters: {
            query: {
                /** @description JSON array of recipients (same structure as POST). */
                recipients: string;
                /** @description Ethereum address */
                nft_contract_address: string;
                /** @description Network to mint on. */
                network: "base" | "optimism" | "base-sepolia";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SimulateNftMintResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ZodError"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "mint-nft": {
        parameters: {
            query?: never;
            header: {
                /** @description Wallet ID to use for transactions */
                "x-wallet-id": components["parameters"]["WalletIdHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description If true, returns immediately after sending the transaction.
                     * @example false
                     */
                    async?: boolean;
                    /**
                     * EthAddress
                     * @description Ethereum address
                     * @example 0x5a927ac639636e534b678e81768ca19e2c6280b7
                     */
                    contract_address: string;
                    /**
                     * @description Network to mint on.
                     * @example base
                     * @enum {string}
                     */
                    network: "base" | "optimism" | "base-sepolia";
                    /** @description List of recipients to mint to (1-200 recipients allowed). */
                    recipients: ({
                        /**
                         * EthAddress
                         * @description Ethereum address
                         * @example 0x5a927ac639636e534b678e81768ca19e2c6280b7
                         */
                        address: string;
                        fid?: unknown;
                        /**
                         * @description Quantity to mint (must be at least 1). Defaults to 1.
                         * @default 1
                         * @example 1
                         */
                        quantity?: number;
                    } | {
                        address?: unknown;
                        /**
                         * Fid
                         * Format: int32
                         * @description The unique identifier of a farcaster user or app (unsigned integer)
                         * @example 3
                         */
                        fid: number;
                        /**
                         * @description Quantity to mint (must be at least 1). Defaults to 1.
                         * @default 1
                         * @example 1
                         */
                        quantity?: number;
                    })[];
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Array of per-recipient mint results (success or error). */
                        transactions: ({
                            /** @description Transaction receipt (if async is false). */
                            receipt?: {
                                block_number: string;
                                gas_used: string;
                                status: string;
                            } | null;
                            /** @description Resolved mint recipient. */
                            recipient: {
                                address: components["schemas"]["EthAddress"];
                                fid?: components["schemas"]["Fid"];
                                quantity: number;
                                /** @description Minted token IDs parsed from Transfer events (sync mode only). */
                                tokens?: {
                                    token_id: string;
                                }[];
                            };
                            transaction_hash: components["schemas"]["PrefixedHexString"];
                        } | {
                            /**
                             * @description Error message for this recipient.
                             * @example No supported mint project detected
                             */
                            error: string;
                            /** @description Mint recipient that failed. */
                            recipient: {
                                address?: components["schemas"]["EthAddress"];
                                fid?: components["schemas"]["Fid"];
                                quantity: number;
                            };
                        })[];
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ZodError"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Payment Required */
            402: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-all-notifications": {
        parameters: {
            query: {
                /** @description FID of the user you you want to fetch notifications for. The response will respect this user's mutes and blocks. */
                fid: number;
                /** @description Notification type to fetch. Comma separated values of follows, recasts, likes, mentions, replies. */
                type?: ("follows" | "recasts" | "likes" | "mentions" | "replies" | "quotes")[];
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-channel-notifications-for-user": {
        parameters: {
            query: {
                /** @description FID of the user you you want to fetch notifications for. The response will respect this user's mutes and blocks. */
                fid: number;
                /** @description Comma separated channel_ids (find list of all channels here - https://docs.neynar.com/reference/list-all-channels) */
                channel_ids: string;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-notifications-by-parent-url-for-user": {
        parameters: {
            query: {
                /** @description FID of the user you you want to fetch notifications for. The response will respect this user's mutes and blocks. */
                fid: number;
                /** @description Comma separated parent_urls */
                parent_urls: string;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "mark-notifications-as-seen": {
        parameters: {
            query?: never;
            header?: {
                /** @description Optional Bearer token for certain endpoints. The token format is described [here](https://docs.farcaster.xyz/reference/warpcast/api#authentication). */
                Authorization?: components["parameters"]["AuthorizationHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MarkNotificationsAsSeenReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OperationResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "publish-reaction": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReactionReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OperationResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "delete-reaction": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReactionReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OperationResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-cast-reactions": {
        parameters: {
            query: {
                hash: string;
                /** @description Customize which reaction types the request should search for. This is a comma-separated string that can include the following values: 'likes' and 'recasts'. By default api returns both. To select multiple types, use a comma-separated list of these values. */
                types: ("all" | "likes" | "recasts")[];
                /** @description Providing this will return a list of reactions that respects this user's mutes and blocks and includes `viewer_context`. */
                viewer_fid?: number;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReactionsCastResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-user-reactions": {
        parameters: {
            query: {
                /** @description The unique identifier of a farcaster user or app (unsigned integer) */
                fid: number;
                /** @description Providing this will return a list of reactions that respects this user's mutes and blocks and includes `viewer_context`. */
                viewer_fid?: number;
                /** @description Type of reaction to fetch (likes or recasts or all) */
                type: "all" | "likes" | "recasts";
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReactionsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "lookup-signer": {
        parameters: {
            query: {
                /**
                 * @description UUID of the signer.
                 *     `signer_uuid` is paired with API key, can't use a `uuid` made with a different API key.
                 */
                signer_uuid: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Signer"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "create-signer": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Signer"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "lookup-developer-managed-signer": {
        parameters: {
            query: {
                /** @description Ed25519 public key */
                public_key: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DeveloperManagedSigner"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "register-signed-key-for-developer-managed-signer": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegisterDeveloperManagedSignedKeyReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DeveloperManagedSigner"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-signers": {
        parameters: {
            query: {
                /** @description A Sign-In with Ethereum (SIWE) message that the user's Ethereum wallet signs. This message includes details such as the domain, address, statement, URI, nonce, and other relevant information following the EIP-4361 standard. It should be structured and URL-encoded. */
                message: string;
                /** @description The digital signature produced by signing the provided SIWE message with the user's Ethereum private key. This signature is used to verify the authenticity of the message and the identity of the signer. */
                signature: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SignerListResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "register-signed-key": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegisterSignerKeyReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Signer"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "lookup-user-storage-allocations": {
        parameters: {
            query: {
                /** @description The unique identifier of a farcaster user or app (unsigned integer) */
                fid: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StorageAllocationsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "buy-storage": {
        parameters: {
            query?: never;
            header: {
                /** @description Wallet ID to use for transactions */
                "x-wallet-id": components["parameters"]["WalletIdHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BuyStorageReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StorageAllocationsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ZodError"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConflictErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "lookup-user-storage-usage": {
        parameters: {
            query: {
                /** @description The unique identifier of a farcaster user or app (unsigned integer) */
                fid: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StorageUsageResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "list-trending-topics": {
        parameters: {
            query?: {
                /** @description Number of topics to fetch. */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TrendingTopicsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "register-account": {
        parameters: {
            query?: never;
            header: {
                /** @description Wallet ID to use for transactions */
                "x-wallet-id": components["parameters"]["WalletIdHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegisterUserReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RegisterUserResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConflictErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "update-user": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateUserReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OperationResponse"];
                };
            };
            /** @description 207 */
            207: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        errors: {
                            message: string;
                        }[];
                        success: boolean;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-user-balance": {
        parameters: {
            query: {
                /** @description FID of the user to fetch */
                fid: number;
                /** @description Comma separated list of networks to fetch balances for */
                networks: ("ethereum" | "optimism" | "base" | "arbitrum")[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BalanceResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "get-user-best-friends": {
        parameters: {
            query: {
                /** @description The FID of the user */
                fid: number;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor */
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BestFriendsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ZodError"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-bulk-users-by-eth-or-sol-address": {
        parameters: {
            query: {
                /** @description Comma separated list of Ethereum or Solana addresses, up to 350 at a time */
                addresses: string;
                /** @description Customize which address types the request should search for. This is a comma-separated string that can include the following values: 'custody_address' and 'verified_address'. By default api returns both. To select multiple types, use a comma-separated list of these values. */
                address_types?: ("custody_address" | "verified_address")[];
                viewer_fid?: number;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BulkUsersByAddressResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-bulk-users": {
        parameters: {
            query: {
                /** @description Comma separated list of FIDs, up to 100 at a time */
                fids: string;
                viewer_fid?: number;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BulkUsersResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-users-by-location": {
        parameters: {
            query: {
                /** @description Latitude of the location */
                latitude: number;
                /** @description Longitude of the location */
                longitude: number;
                /** @description FID of the user viewing the feed. Providing this will return a list of users that respects this user's mutes and blocks and includes `viewer_context`. */
                viewer_fid?: number;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor */
                cursor?: string;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UsersResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "lookup-user-by-username": {
        parameters: {
            query: {
                /** @description Username of the user to fetch */
                username: string;
                viewer_fid?: number;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "lookup-users-by-x-username": {
        parameters: {
            query: {
                /** @description X (Twitter) username to search for, without the @ symbol */
                x_username: string;
                /** @description FID of the viewer for contextual information like follows and blocks */
                viewer_fid?: number;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BulkUsersResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-user-channels": {
        parameters: {
            query: {
                /** @description The FID of the user. */
                fid: number;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChannelListResponse"];
                };
            };
        };
    };
    "lookup-user-by-custody-address": {
        parameters: {
            query: {
                /** @description Custody Address associated with mnemonic */
                custody_address: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "get-fresh-account-FID": {
        parameters: {
            query?: never;
            header: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
                /** @description Wallet ID to use for transactions */
                "x-wallet-id": components["parameters"]["WalletIdHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserFIDResponse"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "follow-user": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FollowReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BulkFollowResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "unfollow-user": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FollowReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BulkFollowResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-user-interactions": {
        parameters: {
            query: {
                /** @description Comma separated list of two FIDs */
                fids: string;
                /** @description Comma seperated list of Interaction type to fetch */
                type?: ("follows" | "recasts" | "likes" | "mentions" | "replies" | "quotes")[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        interactions: components["schemas"]["Notification"][];
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-user-channel-memberships": {
        parameters: {
            query: {
                /** @description The FID of the user. */
                fid: number;
                /** @description Number of results to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ChannelMemberListResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "register-account-onchain": {
        parameters: {
            query?: never;
            header: {
                /** @description Wallet ID to use for transactions */
                "x-wallet-id": components["parameters"]["WalletIdHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegisterUserOnChainReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RegisterUserOnChainResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "search-user": {
        parameters: {
            query: {
                q: string;
                /** @description Providing this will return search results that respects this user's mutes and blocks and includes `viewer_context`. */
                viewer_fid?: number;
                /** @description Number of users to fetch */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: {
                /** @description Enables experimental features including filtering based on the Neynar score. See [docs](https://neynar.notion.site/Experimental-Features-1d2655195a8b80eb98b4d4ae7b76ae4a) for more details. */
                "x-neynar-experimental"?: components["parameters"]["NeynarExperimentalHeader"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserSearchResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-subscribed-to-for-fid": {
        parameters: {
            query: {
                /** @description The unique identifier of a farcaster user or app (unsigned integer) */
                fid: number;
                viewer_fid?: number;
                /** @description The provider of the subscription. */
                subscription_provider: "fabric_stp";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubscribedToResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-subscribers-for-fid": {
        parameters: {
            query: {
                /** @description The unique identifier of a farcaster user or app (unsigned integer) */
                fid: number;
                viewer_fid?: number;
                /** @description The provider of the subscription. */
                subscription_provider: "fabric_stp" | "paragraph";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubscribersResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-subscriptions-for-fid": {
        parameters: {
            query: {
                /** @description The unique identifier of a farcaster user or app (unsigned integer) */
                fid: number;
                /** @description The provider of the subscription. */
                subscription_provider: "fabric_stp";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubscriptionsResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "publish-verification": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddVerificationReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OperationResponse"];
                };
            };
        };
    };
    "delete-verification": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemoveVerificationReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OperationResponse"];
                };
            };
        };
    };
    "fetch-verifications": {
        parameters: {
            query: {
                /** @description FID of the user whose verifications to fetch */
                fid: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        verifications: components["schemas"]["Verification"][];
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "lookup-webhook": {
        parameters: {
            query: {
                webhook_id: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebhookResponse"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "update-webhook": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WebhookPutReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebhookResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "publish-webhook": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WebhookPostReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebhookResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "delete-webhook": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WebhookDeleteReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebhookResponse"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "update-webhook-active-status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WebhookPatchReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebhookResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-webhooks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebhookListResponse"];
                };
            };
        };
    };
    "deploy-fungible": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["DeployFungibleReqBody"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DeployFungibleResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "get-wallet-balances": {
        parameters: {
            query: {
                /** @description Comma-separated list of networks to query. Each value must be a valid network (ethereum, optimism, base, arbitrum). */
                networks: string;
                /** @description Wallet address */
                address: string;
                /** @description Number of results to return (max 100) */
                limit?: number;
                /** @description Pagination cursor. */
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        balances: {
                            /**
                             * @description Token contract address
                             * @example 0x5a927ac639636e534b678e81768ca19e2c6280b7
                             */
                            address: string;
                            /**
                             * @description Raw token balance
                             * @example 1000000000
                             */
                            balance: string;
                            /**
                             * @description Balance value in USD
                             * @example 1000.50
                             */
                            balance_usd: string | null;
                            /**
                             * @description Token decimals
                             * @example 6
                             */
                            decimals: number;
                            /**
                             * @description Token logo URL
                             * @example https://example.com/token.png
                             */
                            image_url: string | null;
                            /**
                             * @description Token name
                             * @example USD Coin
                             */
                            name: string;
                            network: components["schemas"]["Network"];
                            /**
                             * @description Token price in USD
                             * @example 1.00
                             */
                            price_usd: string | null;
                            /**
                             * @description Token symbol
                             * @example USDC
                             */
                            symbol: string;
                        }[];
                        next: {
                            /** @description Pagination cursor for next page, null if no more results */
                            cursor: string | null;
                        };
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "get-token-metadata": {
        parameters: {
            query: {
                /** @description A blockchain network e.g. "ethereum", "optimism", "base", "arbitrum" */
                network: "ethereum" | "optimism" | "base" | "arbitrum";
                /** @description Token contract address */
                address: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        token: {
                            /**
                             * @description Token contract address
                             * @example 0x5a927ac639636e534b678e81768ca19e2c6280b7
                             */
                            address: string;
                            /**
                             * @description Token decimals
                             * @example 6
                             */
                            decimals: number;
                            /**
                             * @description Token description
                             * @example USDC is a fully collateralized US dollar stablecoin
                             */
                            description: string | null;
                            /**
                             * @description Fully diluted valuation in USD
                             * @example 25000000000
                             */
                            fdv: string | null;
                            /**
                             * @description Number of token holders
                             * @example 1500000
                             */
                            holder_count: number | null;
                            /**
                             * @description Token logo URL
                             * @example https://example.com/token.png
                             */
                            image_url: string | null;
                            /**
                             * @description Total liquidity in USD
                             * @example 500000000
                             */
                            liquidity: string | null;
                            /**
                             * @description Market capitalization in USD
                             * @example 25000000000
                             */
                            market_cap: string | null;
                            /**
                             * @description Token name
                             * @example USD Coin
                             */
                            name: string;
                            network: components["schemas"]["Network"];
                            /**
                             * @description 24-hour price change percentage
                             * @example -1.2
                             */
                            price_change_24h_pct: number | null;
                            /**
                             * @description 6-hour price change percentage
                             * @example 0.5
                             */
                            price_change_6h_pct: number | null;
                            /**
                             * @description Source of price data
                             * @example onchain
                             * @enum {string|null}
                             */
                            price_source: "onchain" | "coingecko" | null;
                            /**
                             * @description Timestamp when price data was last updated (milliseconds)
                             * @example 1707177600000
                             */
                            price_updated_at: number | null;
                            /**
                             * @description Token price in USD
                             * @example 1.00
                             */
                            price_usd: string | null;
                            /**
                             * @description Token symbol
                             * @example USDC
                             */
                            symbol: string;
                            /**
                             * @description Total token supply
                             * @example 1000000000000
                             */
                            total_supply: string | null;
                            /**
                             * @description 24-hour trading volume in USD
                             * @example 150000000
                             */
                            volume_24h: string | null;
                            /**
                             * @description 6-hour trading volume in USD
                             * @example 50000000
                             */
                            volume_6h: string | null;
                        };
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "batch-get-token-metadata": {
        parameters: {
            query: {
                /** @description Comma-separated list of blockchain networks. Each value must be a valid network (ethereum, optimism, base, arbitrum). */
                networks: string;
                /** @description Comma-separated list of token contract addresses corresponding to each network */
                addresses: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        tokens: ({
                            /**
                             * @description Token contract address
                             * @example 0x5a927ac639636e534b678e81768ca19e2c6280b7
                             */
                            address: string;
                            /**
                             * @description Token decimals
                             * @example 6
                             */
                            decimals: number;
                            /**
                             * @description Token description
                             * @example USDC is a fully collateralized US dollar stablecoin
                             */
                            description: string | null;
                            /**
                             * @description Fully diluted valuation in USD
                             * @example 25000000000
                             */
                            fdv: string | null;
                            /**
                             * @description Number of token holders
                             * @example 1500000
                             */
                            holder_count: number | null;
                            /**
                             * @description Token logo URL
                             * @example https://example.com/token.png
                             */
                            image_url: string | null;
                            /**
                             * @description Total liquidity in USD
                             * @example 500000000
                             */
                            liquidity: string | null;
                            /**
                             * @description Market capitalization in USD
                             * @example 25000000000
                             */
                            market_cap: string | null;
                            /**
                             * @description Token name
                             * @example USD Coin
                             */
                            name: string;
                            network: components["schemas"]["Network"];
                            /**
                             * @description 24-hour price change percentage
                             * @example -1.2
                             */
                            price_change_24h_pct: number | null;
                            /**
                             * @description 6-hour price change percentage
                             * @example 0.5
                             */
                            price_change_6h_pct: number | null;
                            /**
                             * @description Source of price data
                             * @example onchain
                             * @enum {string|null}
                             */
                            price_source: "onchain" | "coingecko" | null;
                            /**
                             * @description Timestamp when price data was last updated (milliseconds)
                             * @example 1707177600000
                             */
                            price_updated_at: number | null;
                            /**
                             * @description Token price in USD
                             * @example 1.00
                             */
                            price_usd: string | null;
                            /**
                             * @description Token symbol
                             * @example USDC
                             */
                            symbol: string;
                            /**
                             * @description Total token supply
                             * @example 1000000000000
                             */
                            total_supply: string | null;
                            /**
                             * @description 24-hour trading volume in USD
                             * @example 150000000
                             */
                            volume_24h: string | null;
                            /**
                             * @description 6-hour trading volume in USD
                             * @example 50000000
                             */
                            volume_6h: string | null;
                        } | null)[];
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "create-x402-signature": {
        parameters: {
            query?: never;
            header: {
                /** @description Wallet ID to use for transactions */
                "x-wallet-id": components["parameters"]["WalletIdHeader"];
                "x-api-key": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    payment_requirements: {
                        accepts: {
                            /**
                             * EthAddress
                             * @description Ethereum address
                             * @example 0x5a927ac639636e534b678e81768ca19e2c6280b7
                             */
                            asset: string;
                            description: string;
                            extra?: {
                                [key: string]: unknown;
                            } | null;
                            maxAmountRequired: string;
                            maxTimeoutSeconds: number;
                            mimeType?: string;
                            /** @enum {string} */
                            network: "base" | "base-sepolia";
                            outputSchema?: {
                                [key: string]: unknown;
                            } | null;
                            /**
                             * EthAddress
                             * @description Ethereum address
                             * @example 0x5a927ac639636e534b678e81768ca19e2c6280b7
                             */
                            payTo: string;
                            /** Format: uri */
                            resource: string;
                            /** @enum {string} */
                            scheme: "exact";
                        }[];
                        x402Version: 1 | 2;
                    };
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @enum {string} */
                        network: "base" | "base-sepolia";
                        payload: {
                            authorization: {
                                from: components["schemas"]["EthAddress"];
                                nonce: string;
                                to: components["schemas"]["EthAddress"];
                                validAfter: string;
                                validBefore: string;
                                value: string;
                            };
                            signature: string;
                        };
                        /** @enum {string} */
                        scheme: "exact";
                        x402Version: 1 | 2;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "create-x402-siwx": {
        parameters: {
            query?: never;
            header: {
                /** @description Wallet ID to use for transactions */
                "x-wallet-id": components["parameters"]["WalletIdHeader"];
                "x-api-key": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @default 8453 */
                    chainId?: 8453 | 84532;
                    /** Format: uri */
                    resource: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        address: components["schemas"]["EthAddress"];
                        chainId: 8453 | 84532;
                        message: string;
                        signature: string;
                        timestamp: number;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "fetch-subscription-check": {
        parameters: {
            query: {
                /** @description Comma separated list of Ethereum addresses, up to 350 at a time */
                addresses: string;
                /** @description Ethereum address of the STP contract */
                contract_address: string;
                /** @description Chain ID of the STP contract */
                chain_id: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubscriptionCheckResponse"];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "get-credit-drop": {
        parameters: {
            query: {
                /** @description Farcaster ID of the user */
                fid: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * Format: date-time
                         * @description Timestamp at which the drop stops contributing to the effective CU limit. Stamped by the credit-drop job at insert time (default: created_at + 24h).
                         */
                        allowance_expires_at: string;
                        /** @description Whether the credit drop has been claimed */
                        claimed: boolean;
                        /**
                         * Format: date-time
                         * @description When the credit drop was generated
                         */
                        created_at: string;
                        /** @description reward_amount - credits_used, clamped at 0. Spendable only until allowance_expires_at. */
                        credits_remaining: number | null;
                        /** @description Portion of this drop already consumed against STUDIO CU usage (incremented by the CU sync). Forfeited at allowance_expires_at if unused. */
                        credits_used: number;
                        /** @description Whether the credit drop's allowance window has closed (NOW() >= allowance_expires_at). Once true, the drop no longer contributes to the effective CU limit; any unused portion is forfeited. */
                        expired: boolean;
                        /** @description Percentile rank within 7-day global distribution */
                        percentile_score: number | null;
                        /** @description Raw quality score from 0 to 1 */
                        raw_score: number | null;
                        /** @description Credit reward amount */
                        reward_amount: number | null;
                    };
                };
            };
            /** @description Payment Required */
            402: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code: string;
                        message: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        message: string;
                    };
                };
            };
        };
    };
    "claim-credit-drop": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: int32
                     * @description Farcaster ID of the user
                     * @example 3
                     */
                    fid: number;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @enum {boolean} */
                        claimed: true;
                        /** @description New total extra credits balance */
                        new_extra_credits: number;
                        /** @description Amount of credits added */
                        reward_amount: number;
                    };
                };
            };
            /** @description Payment Required */
            402: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code: string;
                        message: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        message: string;
                    };
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        message: string;
                    };
                };
            };
            /** @description Gone */
            410: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        message: string;
                    };
                };
            };
        };
    };
    "list-deployments": {
        parameters: {
            query?: {
                /** @description Farcaster ID of the user. Required for non-admin users. Studio admins can omit to query all deployments. */
                fid?: number;
                /** @description Maximum number of deployments to return. Defaults to 50, max 1000. */
                limit?: number;
                /** @description Number of deployments to skip for pagination. Defaults to 0. */
                offset?: number;
                /** @description Search string to filter deployments by name, display name, or FID. */
                query?: string;
                /** @description Field to sort deployments by. Defaults to updated_at (most recently updated first). */
                sort_by?: "created_at" | "updated_at";
                /** @description Include deleted deployments in the response. Defaults to false. */
                include_deleted?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * Format: date-time
                         * @description Creation timestamp
                         */
                        created_at: string;
                        /**
                         * Format: date-time
                         * @description Deletion timestamp
                         */
                        deleted_at: string | null;
                        /**
                         * @description Dev server process state: stopped, starting, running, crashed, or hung
                         * @enum {string}
                         */
                        dev_server_state?: "stopped" | "starting" | "running" | "crashed" | "hung";
                        /** @description Display name for the project */
                        display_name?: string;
                        /** @description Whether a generated app exists in the deployment */
                        generated_app_exists: boolean;
                        /** @description Whether the generated app is currently serving */
                        generated_app_serving: boolean;
                        /** @description GitHub repository SSH URL */
                        github_url?: string;
                        /** @description Whether the deployment has a Neon database configured */
                        has_database?: boolean;
                        /** @description Deployment ID */
                        id: string;
                        /** @description Deployment is ready to serve app and accept prompts */
                        is_ready: boolean;
                        /** @description Kubernetes deployment name */
                        name: string;
                        /** @description Kubernetes namespace */
                        namespace: string;
                        /** @description Production app deployment status from Vercel */
                        production_app_status?: {
                            /** @description Deployment creation timestamp (Unix ms) */
                            created_at: number;
                            /** @description Deployment state (e.g., READY, BUILDING, ERROR) */
                            deployment_state: string;
                            /** @description Vercel deployment URL */
                            deployment_url: string;
                            /** @description Vercel project ID */
                            project_id: string;
                            /** @description Deployment target (e.g., production, preview) */
                            target?: string;
                        };
                        /**
                         * Format: date-time
                         * @description Last update timestamp
                         */
                        updated_at: string | null;
                        /**
                         * Format: uri
                         * @description Public URL for the deployment
                         */
                        url?: string;
                    }[];
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    "create-deployment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description Display name for the deployment */
                    display_name?: string;
                    /** @description Environment variables for the deployment */
                    env?: {
                        [key: string]: string;
                    };
                    /**
                     * Format: int32
                     * @description Farcaster ID of the user
                     * @example 3
                     */
                    fid: number;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * Format: date-time
                         * @description Creation timestamp
                         */
                        created_at: string;
                        /**
                         * Format: date-time
                         * @description Deletion timestamp
                         */
                        deleted_at: string | null;
                        /**
                         * @description Dev server process state: stopped, starting, running, crashed, or hung
                         * @enum {string}
                         */
                        dev_server_state?: "stopped" | "starting" | "running" | "crashed" | "hung";
                        /** @description Display name for the project */
                        display_name?: string;
                        /** @description Whether a generated app exists in the deployment */
                        generated_app_exists: boolean;
                        /** @description Whether the generated app is currently serving */
                        generated_app_serving: boolean;
                        /** @description GitHub repository SSH URL */
                        github_url?: string;
                        /** @description Whether the deployment has a Neon database configured */
                        has_database?: boolean;
                        /** @description Deployment ID */
                        id: string;
                        /** @description Deployment is ready to serve app and accept prompts */
                        is_ready: boolean;
                        /** @description Kubernetes deployment name */
                        name: string;
                        /** @description Kubernetes namespace */
                        namespace: string;
                        /** @description Production app deployment status from Vercel */
                        production_app_status?: {
                            /** @description Deployment creation timestamp (Unix ms) */
                            created_at: number;
                            /** @description Deployment state (e.g., READY, BUILDING, ERROR) */
                            deployment_state: string;
                            /** @description Vercel deployment URL */
                            deployment_url: string;
                            /** @description Vercel project ID */
                            project_id: string;
                            /** @description Deployment target (e.g., production, preview) */
                            target?: string;
                        };
                        /**
                         * Format: date-time
                         * @description Last update timestamp
                         */
                        updated_at: string | null;
                        /**
                         * Format: uri
                         * @description Public URL for the deployment
                         */
                        url?: string;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    "delete-deployment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: uuid
                     * @description Deployment ID (UUID). If provided, deletes this specific deployment.
                     */
                    deployment_id?: string;
                    /**
                     * Format: int32
                     * @description Farcaster ID of the user
                     * @example 3
                     */
                    fid: number;
                    /** @description Kubernetes deployment name. If not provided and deployment_id not provided, all deployments for the FID will be deleted */
                    name?: string;
                    /** @description Optional Kubernetes namespace. If not provided, will query for the active namespace for the given FID. */
                    namespace?: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        deletedCount?: number;
                        success: boolean;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    "get-account-association": {
        parameters: {
            query?: {
                /** @description Deployment ID */
                deployment_id?: string;
                /** @description Kubernetes namespace name */
                namespace?: string;
                /** @description Kubernetes deployment name */
                name?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Base64URL encoded JFS header */
                        header: string;
                        /** @description Base64URL encoded JFS payload */
                        payload: string;
                        /** @description Base64URL encoded JFS signature */
                        signature: string;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    "associate-deployment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description Signed domain association linking this deployment to a Farcaster account */
                    account_association: {
                        /** @description Base64URL encoded JFS header */
                        header: string;
                        /** @description Base64URL encoded JFS payload */
                        payload: string;
                        /** @description Base64URL encoded JFS signature */
                        signature: string;
                    };
                    /**
                     * Format: uuid
                     * @description Deployment ID (UUID). Required if name not provided.
                     */
                    deployment_id?: string;
                    /**
                     * Format: int32
                     * @description Farcaster ID of the user; if not provided, namespace must be provided
                     * @example 3
                     */
                    fid?: number;
                    /** @description Kubernetes deployment name. Required if deployment_id not provided. */
                    name?: string;
                    /** @description Optional Kubernetes namespace. If not provided, will query for the active namespace for the given FID. */
                    namespace?: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Status message from the miniapp generator */
                        message: string;
                        success: boolean;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    build: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description Build tool to use. "vercel" runs vercel build for production deployment. "npm" runs npm run build for dev server recovery.
                     * @default vercel
                     * @enum {string}
                     */
                    build_type?: "npm" | "vercel";
                    /**
                     * Format: uuid
                     * @description Deployment ID
                     */
                    deployment_id?: string;
                    /** @description Kubernetes deployment name */
                    name?: string;
                    /** @description Kubernetes namespace */
                    namespace?: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    "get-deployment": {
        parameters: {
            query?: {
                /** @description Deployment ID (UUID). Required if name not provided. */
                deployment_id?: string;
                /** @description Farcaster ID of the user; if not provided, namespace must be provided */
                fid?: number;
                /** @description Kubernetes deployment name. Required if deployment_id not provided. */
                name?: string;
                /** @description Optional Kubernetes namespace. If not provided, will query for the active namespace for the given FID. */
                namespace?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * Format: date-time
                         * @description Creation timestamp
                         */
                        created_at: string;
                        /**
                         * Format: date-time
                         * @description Deletion timestamp
                         */
                        deleted_at: string | null;
                        /**
                         * @description Dev server process state: stopped, starting, running, crashed, or hung
                         * @enum {string}
                         */
                        dev_server_state?: "stopped" | "starting" | "running" | "crashed" | "hung";
                        /** @description Display name for the project */
                        display_name?: string;
                        /** @description Whether a generated app exists in the deployment */
                        generated_app_exists: boolean;
                        /** @description Whether the generated app is currently serving */
                        generated_app_serving: boolean;
                        /** @description GitHub repository SSH URL */
                        github_url?: string;
                        /** @description Whether the deployment has a Neon database configured */
                        has_database?: boolean;
                        /** @description Deployment ID */
                        id: string;
                        /** @description Deployment is ready to serve app and accept prompts */
                        is_ready: boolean;
                        /** @description Kubernetes deployment name */
                        name: string;
                        /** @description Kubernetes namespace */
                        namespace: string;
                        /** @description Production app deployment status from Vercel */
                        production_app_status?: {
                            /** @description Deployment creation timestamp (Unix ms) */
                            created_at: number;
                            /** @description Deployment state (e.g., READY, BUILDING, ERROR) */
                            deployment_state: string;
                            /** @description Vercel deployment URL */
                            deployment_url: string;
                            /** @description Vercel project ID */
                            project_id: string;
                            /** @description Deployment target (e.g., production, preview) */
                            target?: string;
                        };
                        /**
                         * Format: date-time
                         * @description Last update timestamp
                         */
                        updated_at: string | null;
                        /**
                         * Format: uri
                         * @description Public URL for the deployment
                         */
                        url?: string;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    "list-conversations": {
        parameters: {
            query?: {
                /** @description Deployment ID (UUID). If provided, filters conversations to this deployment only. */
                deployment_id?: string;
                /** @description Farcaster ID of the user. Required for non-admin users. Studio admins can omit to query all conversations. */
                fid?: number;
                /** @description Kubernetes deployment name. If provided, filters conversations to this deployment only. */
                name?: string;
                /** @description Include deleted conversations in the response. Defaults to false. */
                include_deleted?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description List of conversations */
                        conversations: {
                            /** @description Whether the conversation is an admin conversation */
                            admin: boolean;
                            /**
                             * Format: date-time
                             * @description Creation timestamp
                             */
                            created_at: string;
                            /**
                             * Format: uuid
                             * @description Deployment ID
                             */
                            deployment_id: string;
                            /**
                             * Format: uuid
                             * @description Conversation ID
                             */
                            id: string;
                            /** @description Preview of the last user message (truncated to ~80 chars) */
                            last_message_preview: string | null;
                            /** @description AI-generated title summarizing the conversation topic */
                            title: string | null;
                            /**
                             * Format: date-time
                             * @description Last update timestamp
                             */
                            updated_at: string;
                        }[];
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    "get-conversation-messages": {
        parameters: {
            query: {
                /** @description Deployment ID (UUID). Required if name not provided. */
                deployment_id?: string;
                /** @description Farcaster ID of the user; if not provided, namespace must be provided */
                fid?: number;
                /** @description Kubernetes deployment name. Required if deployment_id not provided. */
                name?: string;
                /** @description Optional Kubernetes namespace. If not provided, will query for the active namespace for the given FID. */
                namespace?: string;
                /** @description Conversation ID */
                conversation_id: string;
                /** @description Include deleted messages in the response. Defaults to false. */
                include_deleted?: boolean;
                /** @description Maximum number of messages to return per page. Defaults to 50, max 100. */
                limit?: number;
                /** @description Pagination cursor for fetching older messages. Omit to start from most recent. */
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description List of messages */
                        messages: {
                            /**
                             * Format: uuid
                             * @description Conversation ID
                             */
                            conversation_id: string;
                            /**
                             * Format: date-time
                             * @description Creation timestamp
                             */
                            created_at: string;
                            /**
                             * Format: uuid
                             * @description Message ID
                             */
                            id: string;
                            /** @description Message content */
                            message: string;
                            /**
                             * @description Message origin
                             * @enum {string}
                             */
                            origin: "user" | "system" | "admin";
                            /** @description Message subtype */
                            subtype?: string;
                            /** @description Message type */
                            type?: string;
                        }[];
                        next: components["schemas"]["NextCursor"];
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    provision: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description Optional BYO PostgreSQL connection string. If omitted, a Neon database is auto-provisioned. */
                    connection_string?: string;
                    /**
                     * Format: uuid
                     * @description Deployment ID (UUID)
                     */
                    deployment_id: string;
                    /**
                     * Format: int32
                     * @description Farcaster ID of the user
                     * @example 3
                     */
                    fid: number;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description True if the database was already provisioned */
                        alreadyProvisioned: boolean;
                        /** @enum {boolean} */
                        success: true;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
        };
    };
    "query-table": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description Columns to select (defaults to all) */
                    columns?: string[];
                    /**
                     * Format: uuid
                     * @description Deployment ID (UUID)
                     */
                    deployment_id: string;
                    /**
                     * Format: int32
                     * @description Farcaster ID of the user. Required for non-admin users.
                     * @example 3
                     */
                    fid?: number;
                    /** @description Maximum rows to return (default: 100, max: 1000) */
                    limit?: number;
                    /** @description Number of rows to skip */
                    offset?: number;
                    /** @description Column to sort by */
                    orderBy?: string;
                    /**
                     * @description Sort direction
                     * @enum {string}
                     */
                    orderDirection?: "asc" | "desc";
                    /** @description Table name to query */
                    table: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Column metadata */
                        columns: {
                            /** @description Column name */
                            name: string;
                            /** @description Column data type */
                            type: string;
                        }[];
                        /** @description Whether more rows are available */
                        hasMore: boolean;
                        /** @description Applied limit */
                        limit: number;
                        /** @description Applied offset */
                        offset: number;
                        /** @description Query result rows */
                        rows: {
                            [key: string]: unknown;
                        }[];
                        /** @description Total number of rows in table */
                        totalCount: number;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
        };
    };
    "execute-sql": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: uuid
                     * @description Deployment ID (UUID)
                     */
                    deployment_id: string;
                    /**
                     * Format: int32
                     * @description Farcaster ID (optional for admins)
                     * @example 3
                     */
                    fid?: number;
                    /** @description SQL query to execute */
                    sql: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Column metadata */
                        columns: {
                            /** @description Column name */
                            name: string;
                            /** @description Column data type */
                            type: string;
                        }[];
                        /** @description Query execution time in milliseconds */
                        executionTimeMs: number;
                        /** @description Number of rows returned */
                        rowCount: number;
                        /** @description Query result rows */
                        rows: {
                            [key: string]: unknown;
                        }[];
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
        };
    };
    "list-tables": {
        parameters: {
            query: {
                /** @description Deployment ID (UUID) */
                deployment_id: string;
                /** @description Farcaster ID of the user. Required for non-admin users. */
                fid?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description List of tables */
                        tables: {
                            /** @description Table name */
                            name: string;
                            /** @description Estimated row count from statistics */
                            rowCountEstimate: number | null;
                            /** @description Schema name */
                            schema: string;
                            /**
                             * @description Table type
                             * @enum {string}
                             */
                            type: "BASE TABLE" | "VIEW";
                        }[];
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
        };
    };
    "insert-rows": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                table_name: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: uuid
                     * @description Deployment ID (UUID)
                     */
                    deployment_id: string;
                    /**
                     * Format: int32
                     * @description Farcaster ID of the user. Required for non-admin users.
                     * @example 3
                     */
                    fid?: number;
                    /** @description Rows to insert (max 100) */
                    rows: {
                        [key: string]: unknown;
                    }[];
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Number of rows inserted */
                        insertedCount: number;
                        /** @description Inserted rows with generated values */
                        rows: {
                            [key: string]: unknown;
                        }[];
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
        };
    };
    "delete-rows": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                table_name: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: uuid
                     * @description Deployment ID (UUID)
                     */
                    deployment_id: string;
                    /**
                     * Format: int32
                     * @description Farcaster ID of the user. Required for non-admin users.
                     * @example 3
                     */
                    fid?: number;
                    /** @description Maximum rows to delete (default: 1000) */
                    limit?: number;
                    /** @description WHERE conditions (equality only, required) */
                    where: {
                        [key: string]: unknown;
                    };
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Number of rows deleted */
                        deletedCount: number;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
        };
    };
    "update-rows": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                table_name: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: uuid
                     * @description Deployment ID (UUID)
                     */
                    deployment_id: string;
                    /**
                     * Format: int32
                     * @description Farcaster ID of the user. Required for non-admin users.
                     * @example 3
                     */
                    fid?: number;
                    /** @description Maximum rows to update (default: 1000) */
                    limit?: number;
                    /** @description Column values to update */
                    set: {
                        [key: string]: unknown;
                    };
                    /** @description WHERE conditions (equality only, required) */
                    where: {
                        [key: string]: unknown;
                    };
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Number of rows updated */
                        updatedCount: number;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
        };
    };
    "get-table-schema": {
        parameters: {
            query: {
                /** @description Deployment ID (UUID) */
                deployment_id: string;
                /** @description Farcaster ID of the user. Required for non-admin users. */
                fid?: number;
            };
            header?: never;
            path: {
                table_name: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Table columns */
                        columns: {
                            /** @description Default value expression */
                            defaultValue: string | null;
                            /** @description Whether the column is part of primary key */
                            isPrimaryKey: boolean;
                            /** @description Column name */
                            name: string;
                            /** @description Whether the column allows NULL values */
                            nullable: boolean;
                            /** @description Ordinal position in table */
                            position: number;
                            /** @description Column data type */
                            type: string;
                        }[];
                        /** @description Foreign key relationships */
                        foreignKeys: {
                            /** @description Local column name */
                            columnName: string;
                            /** @description Constraint name */
                            constraintName: string;
                            /** @description Referenced column name */
                            referencedColumn: string;
                            /** @description Referenced table name */
                            referencedTable: string;
                        }[];
                        /** @description Table indexes */
                        indexes: {
                            /** @description Columns in the index */
                            columns: string[];
                            /** @description Whether this is the primary key index */
                            isPrimary: boolean;
                            /** @description Whether the index enforces uniqueness */
                            isUnique: boolean;
                            /** @description Index name */
                            name: string;
                        }[];
                        /** @description Primary key column names */
                        primaryKeyColumns: string[];
                        /** @description Table name */
                        tableName: string;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code?: string;
                        error: string;
                    };
                };
            };
        };
    };
    "get-dev-status": {
        parameters: {
            query?: {
                /** @description Deployment ID */
                deployment_id?: string;
                /** @description Kubernetes namespace name */
                namespace?: string;
                /** @description Kubernetes deployment name */
                name?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        ready_to_publish: boolean;
                        /** @enum {number} */
                        schema_version: 0;
                    } | ({
                        completed_at: string | null;
                        current_phase: number;
                        last_updated_at: string | null;
                        metadata: {
                            [key: string]: unknown;
                        };
                        phases: {
                            [key: string]: {
                                [key: string]: unknown;
                            };
                        };
                        ready_to_publish: boolean;
                        /** @enum {number} */
                        schema_version: 1;
                        started_at: string | null;
                    } & {
                        [key: string]: unknown;
                    });
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    "export-zip": {
        parameters: {
            query?: {
                /** @description Deployment ID (UUID). Required if name not provided. */
                deployment_id?: string;
                /** @description Farcaster ID of the user; if not provided, namespace must be provided */
                fid?: number;
                /** @description Kubernetes deployment name. Required if deployment_id not provided. */
                name?: string;
                /** @description Optional Kubernetes namespace. If not provided, will query for the active namespace for the given FID. */
                namespace?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Payment Required */
            402: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        code: string;
                        message: string;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    "get-deployment-file": {
        parameters: {
            query: {
                /** @description Deployment ID (UUID). Required if name not provided. */
                deployment_id?: string;
                /** @description Farcaster ID of the user; if not provided, namespace must be provided */
                fid?: number;
                /** @description Kubernetes deployment name. Required if deployment_id not provided. */
                name?: string;
                /** @description Optional Kubernetes namespace. If not provided, will query for the active namespace for the given FID. */
                namespace?: string;
                /** @description File path relative to gen/ */
                file_path: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description File contents */
                        content: string;
                        /** @description File path relative to gen/ */
                        path: string;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    "list-deployment-files": {
        parameters: {
            query?: {
                /** @description Deployment ID (UUID). Required if name not provided. */
                deployment_id?: string;
                /** @description Farcaster ID of the user; if not provided, namespace must be provided */
                fid?: number;
                /** @description Kubernetes deployment name. Required if deployment_id not provided. */
                name?: string;
                /** @description Optional Kubernetes namespace. If not provided, will query for the active namespace for the given FID. */
                namespace?: string;
                /** @description Directory path relative to gen/ (defaults to root) */
                directory?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description List of files and directories */
                        files: {
                            /** @description Whether this is a directory */
                            is_directory: boolean;
                            /** @description File or directory name */
                            name: string;
                            /** @description Full path relative to gen/ */
                            path: string;
                        }[];
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    "prompt-deployment-stream": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: uuid
                     * @description Optional conversation ID to continue an existing chat. If not provided, a new conversation will be created.
                     */
                    conversation_id?: string;
                    /**
                     * Format: uuid
                     * @description Deployment ID (UUID). Required if name not provided.
                     */
                    deployment_id?: string;
                    /**
                     * Format: int32
                     * @description Farcaster ID of the user; if not provided, namespace must be provided
                     * @example 3
                     */
                    fid?: number;
                    /** @description Optional images for multimodal messages. Each image is base64-encoded. */
                    images?: {
                        /** @description Base64-encoded image data or data URL (data:image/png;base64,...) */
                        data: string;
                        /**
                         * @description MIME type of the image, e.g. image/png
                         * @enum {string}
                         */
                        mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp";
                    }[];
                    /** @description Kubernetes deployment name. Required if deployment_id not provided. */
                    name?: string;
                    /** @description Optional Kubernetes namespace. If not provided, will query for the active namespace for the given FID. */
                    namespace?: string;
                    /** @description Prompt string to send to the deployment */
                    prompt: string;
                    /** @description Optional Claude SDK session ID to resume an existing Claude Code session. Enables session-based conversation continuity. */
                    session_id?: string;
                    /**
                     * @description System prompt variant to use. Defaults to stable if not provided.
                     * @enum {string}
                     */
                    system_prompt_variant?: "canary" | "beta" | "stable";
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description 202 */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /**
                         * Format: uuid
                         * @description The conversation ID
                         */
                        conversation_id: string;
                        /**
                         * @description Indicates the message was queued to the active session
                         * @enum {boolean}
                         */
                        queued: true;
                        /** @description The session ID the message was queued to */
                        session_id: string;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Content Too Large */
            413: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    recover: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: uuid
                     * @description Deployment ID
                     */
                    deployment_id?: string;
                    /** @description Kubernetes deployment name */
                    name?: string;
                    /** @description Kubernetes namespace */
                    namespace?: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    "list-secrets": {
        parameters: {
            query: {
                /** @description Deployment ID to list secrets for */
                deployment_id: string;
                /** @description Optional filter by environment variable name */
                key?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        secrets: {
                            /** @description Environment variable ID */
                            id: string;
                            /** @description Environment variable name */
                            key: string;
                            /** @description Masked preview of the secret value (e.g. "sk_l…t1b3") */
                            preview?: string;
                            /**
                             * @description Whether this is a system-managed or user-defined variable
                             * @enum {string}
                             */
                            type: "system" | "user";
                        }[];
                        /** @enum {boolean} */
                        success: true;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "upsert-secrets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: uuid
                     * @description Deployment ID to add secrets to
                     */
                    deployment_id: string;
                    /** @description Secrets to create */
                    secrets: {
                        /** @description Environment variable name */
                        key: string;
                        /** @description Environment variable value */
                        value: string;
                    }[];
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @enum {boolean} */
                        success: true;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "delete-secrets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: uuid
                     * @description Deployment ID to delete secrets from
                     */
                    deployment_id: string;
                    /** @description Secret IDs to delete */
                    ids: string[];
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @enum {boolean} */
                        success: true;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ErrorRes"];
                };
            };
        };
    };
    "cancel-session": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: uuid
                     * @description The conversation ID of the session to cancel
                     */
                    conversation_id: string;
                    /**
                     * Format: uuid
                     * @description Deployment ID (UUID). Required if name not provided.
                     */
                    deployment_id?: string;
                    /**
                     * Format: int32
                     * @description Farcaster ID of the user; if not provided, namespace must be provided
                     * @example 3
                     */
                    fid?: number;
                    /** @description Kubernetes deployment name. Required if deployment_id not provided. */
                    name?: string;
                    /** @description Optional Kubernetes namespace. If not provided, will query for the active namespace for the given FID. */
                    namespace?: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Whether an active session was found and cancelled */
                        cancelled: boolean;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    "start-app": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: uuid
                     * @description Deployment ID (UUID). Required if name not provided.
                     */
                    deployment_id?: string;
                    /**
                     * Format: int32
                     * @description Farcaster ID of the user; if not provided, namespace must be provided
                     * @example 3
                     */
                    fid?: number;
                    /** @description Kubernetes deployment name. Required if deployment_id not provided. */
                    name?: string;
                    /** @description Optional Kubernetes namespace. If not provided, will query for the active namespace for the given FID. */
                    namespace?: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Status message */
                        message: string;
                        success: boolean;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Request Timeout */
            408: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    "stop-app": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: uuid
                     * @description Deployment ID (UUID). Required if name not provided.
                     */
                    deployment_id?: string;
                    /**
                     * Format: int32
                     * @description Farcaster ID of the user; if not provided, namespace must be provided
                     * @example 3
                     */
                    fid?: number;
                    /** @description Kubernetes deployment name. Required if deployment_id not provided. */
                    name?: string;
                    /** @description Optional Kubernetes namespace. If not provided, will query for the active namespace for the given FID. */
                    namespace?: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Status message */
                        message: string;
                        success: boolean;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    "upload-image": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Uploaded filename */
                        filename?: string;
                        /** @description Status message */
                        message: string;
                        /** @description Whether the upload was successful */
                        success: boolean;
                        /** @description URL path to access the image */
                        url?: string;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    "upload-image-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: uuid
                     * @description Deployment ID (UUID). Required if name not provided.
                     */
                    deployment_id?: string;
                    /**
                     * Format: int32
                     * @description Farcaster ID of the user; if not provided, namespace must be provided
                     * @example 3
                     */
                    fid?: number;
                    /** @description Kubernetes deployment name. Required if deployment_id not provided. */
                    name?: string;
                    /** @description Optional Kubernetes namespace. If not provided, will query for the active namespace for the given FID. */
                    namespace?: string;
                    /**
                     * Format: uri
                     * @description URL of the image to download
                     */
                    url: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Uploaded filename */
                        filename?: string;
                        /** @description Status message */
                        message: string;
                        /** @description Whether the upload was successful */
                        success: boolean;
                        /** @description URL path to access the image */
                        url?: string;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    "report-studio-usage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description Compute units to add (must be positive) */
                    compute_units: number;
                    deployment_id: string;
                    /** Format: uuid */
                    developer_uuid: string;
                    /**
                     * Format: uuid
                     * @description UUID from the Claude SDK result message
                     */
                    idempotency_key: string;
                    /** @description Claude session ID for audit trail */
                    session_id?: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @enum {boolean} */
                        accepted: true;
                        duplicate: boolean;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Unauthorized */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                    };
                };
            };
        };
    };
    "deploy-to-vercel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: uuid
                     * @description Deployment ID (UUID). Required if name not provided.
                     */
                    deployment_id?: string;
                    /** @description Environment variables for the Vercel deployment */
                    env?: {
                        [key: string]: string;
                    };
                    /**
                     * Format: int32
                     * @description Farcaster ID of the user; if not provided, namespace must be provided
                     * @example 3
                     */
                    fid?: number;
                    /** @description Deployment name (used for both GitHub repo and Vercel project). Required if deployment_id not provided. */
                    name?: string;
                    /** @description Kubernetes namespace name */
                    namespace?: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description URL of the deployed Vercel app */
                        deployment_url?: string;
                        /** @description Production URL under neynar.app domain */
                        production_url?: string;
                        /** @description Vercel project ID */
                        project_id?: string;
                        /** @description Whether the deployment succeeded */
                        success: boolean;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                        /** @enum {boolean} */
                        success: false;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                        /** @enum {boolean} */
                        success: false;
                    };
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                        /** @enum {boolean} */
                        success: false;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                        /** @enum {boolean} */
                        success: false;
                    };
                };
            };
        };
    };
    "assign-custom-domain": {
        parameters: {
            query: {
                /** @description Farcaster ID of the requesting user */
                fid: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: uuid
                     * @description Deployment ID (UUID) of the miniapp
                     */
                    deployment_id: string;
                    /** @description The desired subdomain (without .neynar.app suffix). Must be 3-63 characters, lowercase alphanumeric and hyphens only. */
                    subdomain: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description The full assigned domain (e.g., myapp.neynar.app) */
                        domain: string;
                        /** @description The previous production domain, if any */
                        previous_domain?: string;
                        /** @enum {boolean} */
                        success: true;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                        /** @enum {boolean} */
                        success: false;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                        /** @enum {boolean} */
                        success: false;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                        /** @enum {boolean} */
                        success: false;
                    };
                };
            };
            /** @description Conflict */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                        /** @enum {boolean} */
                        success: false;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                        /** @enum {boolean} */
                        success: false;
                    };
                };
            };
        };
    };
    "check-domain-availability": {
        parameters: {
            query: {
                /** @description Farcaster ID of the requesting user */
                fid: number;
                /** @description The desired subdomain (without .neynar.app suffix). Must be 3-63 characters, lowercase alphanumeric and hyphens only. */
                subdomain: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Whether the subdomain is available */
                        available: boolean;
                        /** @description The full domain (e.g., myapp.neynar.app) */
                        domain: string;
                        /** @description Reason why the subdomain is unavailable (e.g., "reserved", "taken") */
                        reason?: string;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                        /** @enum {boolean} */
                        success: false;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                        /** @enum {boolean} */
                        success: false;
                    };
                };
            };
        };
    };
    "vercel-deployment-logs": {
        parameters: {
            query?: {
                /** @description Deployment ID (UUID). Required if name not provided. */
                deployment_id?: string;
                /** @description Farcaster ID of the user */
                fid?: number;
                /** @description K8s Namespace name */
                namespace?: string;
                /** @description Deployment name used to identify the Vercel project. Required if deployment_id not provided. */
                name?: string;
                /** @description Maximum number of log events to return. Defaults to 100. */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Array of log events */
                        logs: {
                            /** @description Timestamp of the log event */
                            created: number;
                            /** @description Date of the log event */
                            date: number;
                            /** @description Log text content */
                            text?: string;
                            /** @description Event type (stdout, stderr, etc.) */
                            type: string;
                        }[];
                        /** @description Whether the request succeeded */
                        success: boolean;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                        /** @enum {boolean} */
                        success: false;
                    };
                };
            };
            /** @description Forbidden */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                        /** @enum {boolean} */
                        success: false;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                        /** @enum {boolean} */
                        success: false;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                        /** @enum {boolean} */
                        success: false;
                    };
                };
            };
        };
    };
    "vercel-deployment-status": {
        parameters: {
            query?: {
                /** @description Deployment ID (UUID). Required if name not provided. */
                deployment_id?: string;
                /** @description Farcaster ID of the user; if not provided, namespace must be provided */
                fid?: number;
                /** @description K8s Namespace name */
                namespace?: string;
                /** @description Deployment name used to identify the Vercel project. Required if deployment_id not provided. */
                name?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @description Timestamp when deployment was created */
                        created_at?: number;
                        /** @description Current state of the deployment */
                        deployment_state?: string;
                        /** @description URL of the deployed Vercel app */
                        deployment_url?: string;
                        /** @description Vercel project ID */
                        project_id?: string;
                        /** @description Whether the request succeeded */
                        success: boolean;
                        /** @description Deployment target environment */
                        target?: string;
                    };
                };
            };
            /** @description Bad Request */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                        /** @enum {boolean} */
                        success: false;
                    };
                };
            };
            /** @description Resource not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                        /** @enum {boolean} */
                        success: false;
                    };
                };
            };
            /** @description Server Error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        error: string;
                        /** @enum {boolean} */
                        success: false;
                    };
                };
            };
        };
    };
}
