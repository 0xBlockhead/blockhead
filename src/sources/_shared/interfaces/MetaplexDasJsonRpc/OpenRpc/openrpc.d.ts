export type paths = Record<string, never>;
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** GetAssetProof */
        GetAssetProof: {
            id: string;
        };
        /** AssetProof */
        AssetProof: {
            leaf: string;
            /** Format: int64 */
            node_index: number;
            proof: string[];
            root: string;
            tree_id: string;
        };
        /** GetAssetProofs */
        GetAssetProofs: {
            ids: string[];
        };
        /** Map_of_Nullable_AssetProof */
        Map_of_Nullable_AssetProof: {
            [key: string]: {
                leaf: string;
                /** Format: int64 */
                node_index: number;
                proof: string[];
                root: string;
                tree_id: string;
            } | null;
        };
        /** GetAsset */
        GetAsset: {
            id: string;
            /** @default null */
            options: {
                /** @default false */
                showCollectionMetadata: boolean;
                /** @default false */
                showFungible: boolean;
                /** @default false */
                showInscription: boolean;
                /** @default false */
                showUnverifiedCollections: boolean;
                /** @default false */
                showZeroBalance: boolean;
            } | null;
        };
        /** Asset */
        Asset: {
            agent_token?: string | null;
            asset_signer?: string | null;
            authorities?: {
                address: string;
                scopes: ("full" | "royalty" | "metadata" | "extension")[];
            }[] | null;
            burnt: boolean;
            compression?: {
                asset_data_hash?: string | null;
                asset_hash: string;
                collection_hash?: string | null;
                compressed: boolean;
                creator_hash: string;
                data_hash: string;
                eligible: boolean;
                /** Format: uint8 */
                flags?: number | null;
                /** Format: int64 */
                leaf_id: number;
                /** Format: int64 */
                seq: number;
                tree: string;
            } | null;
            content?: {
                $schema: string;
                category?: unknown;
                files?: {
                    contexts?: ("wallet-default" | "web-desktop" | "web-mobile" | "app-mobile" | "app-desktop" | "app" | "vr")[] | null;
                    mime?: string | null;
                    quality?: {
                        $$schema: string;
                    } | null;
                    uri?: string | null;
                }[] | null;
                json_uri: string;
                links?: {
                    [key: string]: unknown;
                } | null;
                metadata: {
                    [key: string]: unknown;
                };
            } | null;
            creators?: {
                address: string;
                /** Format: int32 */
                share: number;
                verified: boolean;
            }[] | null;
            /** @description Leaf creators used for hashing. Present when royalties are inherited from the collection (typically empty); display payees remain on `creators`. */
            creators_raw?: {
                address: string;
                /** Format: int32 */
                share: number;
                verified: boolean;
            }[] | null;
            external_plugins?: unknown;
            grouping?: {
                collection_metadata?: {
                    [key: string]: unknown;
                } | null;
                group_key: string;
                group_value?: string | null;
                verified?: boolean | null;
            }[] | null;
            id: string;
            inscription?: {
                authority: string;
                content: string;
                encoding: string;
                inscription_data: string;
                /** Format: uint64 */
                order: number;
                root: string;
                /** Format: uint32 */
                size: number;
                validation_hash?: string | null;
            } | null;
            /** @enum {string} */
            interface: "V1_NFT" | "V1_PRINT" | "V2_NFT" | "LEGACY_NFT" | "FungibleAsset" | "FungibleToken" | "Identity" | "Executable" | "ProgrammableNFT" | "MplCoreAsset" | "MplCoreCollection" | "MplCoreGroup" | "MplBubblegumV2" | "Custom";
            is_agent?: boolean | null;
            mint_extensions?: unknown;
            mpl_core_info?: {
                /** Format: int32 */
                current_size?: number | null;
                /** Format: int32 */
                num_minted?: number | null;
                /** Format: int32 */
                plugins_json_version?: number | null;
            } | null;
            mutable: boolean;
            ownership?: {
                delegate?: string | null;
                delegated: boolean;
                frozen: boolean;
                non_transferable?: boolean | null;
                owner: string;
                /** @enum {string} */
                ownership_model: "single" | "token";
            } | null;
            plugins?: unknown;
            royalty?: {
                /** Format: uint32 */
                basis_points: number;
                /** Format: uint32 */
                basis_points_raw?: number | null;
                inherited?: boolean | null;
                locked: boolean;
                /** Format: double */
                percent: number;
                primary_sale_happened: boolean;
                /** @enum {string} */
                royalty_model: "creators" | "fanout" | "single";
                target?: string | null;
            } | null;
            supply?: {
                /** Format: uint64 */
                edition_nonce?: number | null;
                /** Format: uint64 */
                print_current_supply: number;
                /** Format: uint64 */
                print_max_supply: number;
            } | null;
            token_info?: {
                /** Format: uint8 */
                decimals: number;
                freeze_authority?: string | null;
                mint_authority?: string | null;
                /** Format: uint64 */
                supply: number;
                token_program: string;
            } | null;
            unknown_external_plugins?: unknown;
            unknown_plugins?: unknown;
            uses?: {
                /** Format: uint64 */
                remaining: number;
                /** Format: uint64 */
                total: number;
                /** @enum {string} */
                use_method: "Burn" | "Multiple" | "Single";
            } | null;
        };
        /** GetAssets */
        GetAssets: {
            ids: string[];
            /** @default null */
            options: {
                /** @default false */
                showCollectionMetadata: boolean;
                /** @default false */
                showFungible: boolean;
                /** @default false */
                showInscription: boolean;
                /** @default false */
                showUnverifiedCollections: boolean;
                /** @default false */
                showZeroBalance: boolean;
            } | null;
        };
        /** Array_of_Nullable_Asset */
        Array_of_Nullable_Asset: ({
            agent_token?: string | null;
            asset_signer?: string | null;
            authorities?: {
                address: string;
                scopes: ("full" | "royalty" | "metadata" | "extension")[];
            }[] | null;
            burnt: boolean;
            compression?: {
                asset_data_hash?: string | null;
                asset_hash: string;
                collection_hash?: string | null;
                compressed: boolean;
                creator_hash: string;
                data_hash: string;
                eligible: boolean;
                /** Format: uint8 */
                flags?: number | null;
                /** Format: int64 */
                leaf_id: number;
                /** Format: int64 */
                seq: number;
                tree: string;
            } | null;
            content?: {
                $schema: string;
                category?: unknown;
                files?: {
                    contexts?: ("wallet-default" | "web-desktop" | "web-mobile" | "app-mobile" | "app-desktop" | "app" | "vr")[] | null;
                    mime?: string | null;
                    quality?: {
                        $$schema: string;
                    } | null;
                    uri?: string | null;
                }[] | null;
                json_uri: string;
                links?: {
                    [key: string]: unknown;
                } | null;
                metadata: {
                    [key: string]: unknown;
                };
            } | null;
            creators?: {
                address: string;
                /** Format: int32 */
                share: number;
                verified: boolean;
            }[] | null;
            /** @description Leaf creators used for hashing. Present when royalties are inherited from the collection (typically empty); display payees remain on `creators`. */
            creators_raw?: {
                address: string;
                /** Format: int32 */
                share: number;
                verified: boolean;
            }[] | null;
            external_plugins?: unknown;
            grouping?: {
                collection_metadata?: {
                    [key: string]: unknown;
                } | null;
                group_key: string;
                group_value?: string | null;
                verified?: boolean | null;
            }[] | null;
            id: string;
            inscription?: {
                authority: string;
                content: string;
                encoding: string;
                inscription_data: string;
                /** Format: uint64 */
                order: number;
                root: string;
                /** Format: uint32 */
                size: number;
                validation_hash?: string | null;
            } | null;
            /** @enum {string} */
            interface: "V1_NFT" | "V1_PRINT" | "V2_NFT" | "LEGACY_NFT" | "FungibleAsset" | "FungibleToken" | "Identity" | "Executable" | "ProgrammableNFT" | "MplCoreAsset" | "MplCoreCollection" | "MplCoreGroup" | "MplBubblegumV2" | "Custom";
            is_agent?: boolean | null;
            mint_extensions?: unknown;
            mpl_core_info?: {
                /** Format: int32 */
                current_size?: number | null;
                /** Format: int32 */
                num_minted?: number | null;
                /** Format: int32 */
                plugins_json_version?: number | null;
            } | null;
            mutable: boolean;
            ownership?: {
                delegate?: string | null;
                delegated: boolean;
                frozen: boolean;
                non_transferable?: boolean | null;
                owner: string;
                /** @enum {string} */
                ownership_model: "single" | "token";
            } | null;
            plugins?: unknown;
            royalty?: {
                /** Format: uint32 */
                basis_points: number;
                /** Format: uint32 */
                basis_points_raw?: number | null;
                inherited?: boolean | null;
                locked: boolean;
                /** Format: double */
                percent: number;
                primary_sale_happened: boolean;
                /** @enum {string} */
                royalty_model: "creators" | "fanout" | "single";
                target?: string | null;
            } | null;
            supply?: {
                /** Format: uint64 */
                edition_nonce?: number | null;
                /** Format: uint64 */
                print_current_supply: number;
                /** Format: uint64 */
                print_max_supply: number;
            } | null;
            token_info?: {
                /** Format: uint8 */
                decimals: number;
                freeze_authority?: string | null;
                mint_authority?: string | null;
                /** Format: uint64 */
                supply: number;
                token_program: string;
            } | null;
            unknown_external_plugins?: unknown;
            unknown_plugins?: unknown;
            uses?: {
                /** Format: uint64 */
                remaining: number;
                /** Format: uint64 */
                total: number;
                /** @enum {string} */
                use_method: "Burn" | "Multiple" | "Single";
            } | null;
        } | null)[];
        /** GetAssetsByOwner */
        GetAssetsByOwner: {
            after?: string | null;
            before?: string | null;
            /** @default null */
            cursor: string | null;
            /** Format: uint32 */
            limit?: number | null;
            /** @default null */
            options: {
                /** @default false */
                showCollectionMetadata: boolean;
                /** @default false */
                showFungible: boolean;
                /** @default false */
                showInscription: boolean;
                /** @default false */
                showUnverifiedCollections: boolean;
                /** @default false */
                showZeroBalance: boolean;
            } | null;
            ownerAddress: string;
            /** Format: uint32 */
            page?: number | null;
            sortBy?: {
                /** @enum {string} */
                sortBy: "id" | "created" | "updated" | "recent_action" | "none";
                /** @enum {string|null} */
                sortDirection?: "asc" | "desc" | null;
            } | null;
        };
        /** AssetList */
        AssetList: {
            after?: string | null;
            before?: string | null;
            cursor?: string | null;
            errors?: {
                /** @default  */
                error: string;
                /** @default  */
                id: string;
            }[];
            /** @default [] */
            items: {
                agent_token?: string | null;
                asset_signer?: string | null;
                authorities?: {
                    address: string;
                    scopes: ("full" | "royalty" | "metadata" | "extension")[];
                }[] | null;
                burnt: boolean;
                compression?: {
                    asset_data_hash?: string | null;
                    asset_hash: string;
                    collection_hash?: string | null;
                    compressed: boolean;
                    creator_hash: string;
                    data_hash: string;
                    eligible: boolean;
                    /** Format: uint8 */
                    flags?: number | null;
                    /** Format: int64 */
                    leaf_id: number;
                    /** Format: int64 */
                    seq: number;
                    tree: string;
                } | null;
                content?: {
                    $schema: string;
                    category?: unknown;
                    files?: {
                        contexts?: ("wallet-default" | "web-desktop" | "web-mobile" | "app-mobile" | "app-desktop" | "app" | "vr")[] | null;
                        mime?: string | null;
                        quality?: {
                            $$schema: string;
                        } | null;
                        uri?: string | null;
                    }[] | null;
                    json_uri: string;
                    links?: {
                        [key: string]: unknown;
                    } | null;
                    metadata: {
                        [key: string]: unknown;
                    };
                } | null;
                creators?: {
                    address: string;
                    /** Format: int32 */
                    share: number;
                    verified: boolean;
                }[] | null;
                /** @description Leaf creators used for hashing. Present when royalties are inherited from the collection (typically empty); display payees remain on `creators`. */
                creators_raw?: {
                    address: string;
                    /** Format: int32 */
                    share: number;
                    verified: boolean;
                }[] | null;
                external_plugins?: unknown;
                grouping?: {
                    collection_metadata?: {
                        [key: string]: unknown;
                    } | null;
                    group_key: string;
                    group_value?: string | null;
                    verified?: boolean | null;
                }[] | null;
                id: string;
                inscription?: {
                    authority: string;
                    content: string;
                    encoding: string;
                    inscription_data: string;
                    /** Format: uint64 */
                    order: number;
                    root: string;
                    /** Format: uint32 */
                    size: number;
                    validation_hash?: string | null;
                } | null;
                /** @enum {string} */
                interface: "V1_NFT" | "V1_PRINT" | "V2_NFT" | "LEGACY_NFT" | "FungibleAsset" | "FungibleToken" | "Identity" | "Executable" | "ProgrammableNFT" | "MplCoreAsset" | "MplCoreCollection" | "MplCoreGroup" | "MplBubblegumV2" | "Custom";
                is_agent?: boolean | null;
                mint_extensions?: unknown;
                mpl_core_info?: {
                    /** Format: int32 */
                    current_size?: number | null;
                    /** Format: int32 */
                    num_minted?: number | null;
                    /** Format: int32 */
                    plugins_json_version?: number | null;
                } | null;
                mutable: boolean;
                ownership?: {
                    delegate?: string | null;
                    delegated: boolean;
                    frozen: boolean;
                    non_transferable?: boolean | null;
                    owner: string;
                    /** @enum {string} */
                    ownership_model: "single" | "token";
                } | null;
                plugins?: unknown;
                royalty?: {
                    /** Format: uint32 */
                    basis_points: number;
                    /** Format: uint32 */
                    basis_points_raw?: number | null;
                    inherited?: boolean | null;
                    locked: boolean;
                    /** Format: double */
                    percent: number;
                    primary_sale_happened: boolean;
                    /** @enum {string} */
                    royalty_model: "creators" | "fanout" | "single";
                    target?: string | null;
                } | null;
                supply?: {
                    /** Format: uint64 */
                    edition_nonce?: number | null;
                    /** Format: uint64 */
                    print_current_supply: number;
                    /** Format: uint64 */
                    print_max_supply: number;
                } | null;
                token_info?: {
                    /** Format: uint8 */
                    decimals: number;
                    freeze_authority?: string | null;
                    mint_authority?: string | null;
                    /** Format: uint64 */
                    supply: number;
                    token_program: string;
                } | null;
                unknown_external_plugins?: unknown;
                unknown_plugins?: unknown;
                uses?: {
                    /** Format: uint64 */
                    remaining: number;
                    /** Format: uint64 */
                    total: number;
                    /** @enum {string} */
                    use_method: "Burn" | "Multiple" | "Single";
                } | null;
            }[];
            /**
             * Format: uint32
             * @default 0
             */
            limit: number;
            /** Format: uint32 */
            page?: number | null;
            /**
             * Format: uint32
             * @default 0
             */
            total: number;
        };
        /** GetAssetsByGroup */
        GetAssetsByGroup: {
            after?: string | null;
            before?: string | null;
            /** @default null */
            cursor: string | null;
            groupKey: string;
            groupValue: string;
            /** Format: uint32 */
            limit?: number | null;
            /** @default null */
            options: {
                /** @default false */
                showCollectionMetadata: boolean;
                /** @default false */
                showFungible: boolean;
                /** @default false */
                showInscription: boolean;
                /** @default false */
                showUnverifiedCollections: boolean;
                /** @default false */
                showZeroBalance: boolean;
            } | null;
            /** Format: uint32 */
            page?: number | null;
            sortBy?: {
                /** @enum {string} */
                sortBy: "id" | "created" | "updated" | "recent_action" | "none";
                /** @enum {string|null} */
                sortDirection?: "asc" | "desc" | null;
            } | null;
        };
        /** GetAssetsByCreator */
        GetAssetsByCreator: {
            after?: string | null;
            before?: string | null;
            creatorAddress: string;
            /** @default null */
            cursor: string | null;
            /** Format: uint32 */
            limit?: number | null;
            onlyVerified?: boolean | null;
            /** @default null */
            options: {
                /** @default false */
                showCollectionMetadata: boolean;
                /** @default false */
                showFungible: boolean;
                /** @default false */
                showInscription: boolean;
                /** @default false */
                showUnverifiedCollections: boolean;
                /** @default false */
                showZeroBalance: boolean;
            } | null;
            /** Format: uint32 */
            page?: number | null;
            sortBy?: {
                /** @enum {string} */
                sortBy: "id" | "created" | "updated" | "recent_action" | "none";
                /** @enum {string|null} */
                sortDirection?: "asc" | "desc" | null;
            } | null;
        };
        /** GetAssetsByAuthority */
        GetAssetsByAuthority: {
            after?: string | null;
            authorityAddress: string;
            before?: string | null;
            /** @default null */
            cursor: string | null;
            /** Format: uint32 */
            limit?: number | null;
            /** @default null */
            options: {
                /** @default false */
                showCollectionMetadata: boolean;
                /** @default false */
                showFungible: boolean;
                /** @default false */
                showInscription: boolean;
                /** @default false */
                showUnverifiedCollections: boolean;
                /** @default false */
                showZeroBalance: boolean;
            } | null;
            /** Format: uint32 */
            page?: number | null;
            sortBy?: {
                /** @enum {string} */
                sortBy: "id" | "created" | "updated" | "recent_action" | "none";
                /** @enum {string|null} */
                sortDirection?: "asc" | "desc" | null;
            } | null;
        };
        /** SearchAssets */
        SearchAssets: {
            after?: string | null;
            /** @default null */
            agentToken: string | null;
            /** @default null */
            assetSigner: string | null;
            authorityAddress?: string | null;
            before?: string | null;
            burnt?: boolean | null;
            compressed?: boolean | null;
            compressible?: boolean | null;
            /** @enum {string|null} */
            conditionType?: "all" | "any" | null;
            creatorAddress?: string | null;
            creatorVerified?: boolean | null;
            /** @default null */
            cursor: string | null;
            delegate?: string | null;
            frozen?: boolean | null;
            grouping?: [
                string,
                string
            ] | null;
            /** @enum {string|null} */
            interface?: "V1_NFT" | "V1_PRINT" | "V2_NFT" | "LEGACY_NFT" | "FungibleAsset" | "FungibleToken" | "Identity" | "Executable" | "ProgrammableNFT" | "MplCoreAsset" | "MplCoreCollection" | "MplCoreGroup" | "MplBubblegumV2" | "Custom" | null;
            /** @default null */
            isAgent: boolean | null;
            /** @default null */
            jsonUri: string | null;
            /** Format: uint32 */
            limit?: number | null;
            /** @default null */
            name: string | null;
            negate?: boolean | null;
            /** @default null */
            options: {
                /** @default false */
                showCollectionMetadata: boolean;
                /** @default false */
                showFungible: boolean;
                /** @default false */
                showInscription: boolean;
                /** @default false */
                showUnverifiedCollections: boolean;
                /** @default false */
                showZeroBalance: boolean;
            } | null;
            ownerAddress?: string | null;
            /** @enum {string|null} */
            ownerType?: "single" | "token" | null;
            /** Format: uint32 */
            page?: number | null;
            /** Format: uint32 */
            royaltyAmount?: number | null;
            royaltyTarget?: string | null;
            /** @enum {string|null} */
            royaltyTargetType?: "creators" | "fanout" | "single" | null;
            sortBy?: {
                /** @enum {string} */
                sortBy: "id" | "created" | "updated" | "recent_action" | "none";
                /** @enum {string|null} */
                sortDirection?: "asc" | "desc" | null;
            } | null;
            /** Format: uint64 */
            supply?: number | null;
            supplyMint?: string | null;
            /** @enum {string|null} */
            tokenType?: "Fungible" | "NonFungible" | "Compressed" | "Nft" | "All" | null;
        };
        /** GetAssetSignatures */
        GetAssetSignatures: {
            after?: string | null;
            before?: string | null;
            /** @default null */
            cursor: string | null;
            id?: string | null;
            /** Format: int64 */
            leafIndex?: number | null;
            /** Format: uint32 */
            limit?: number | null;
            /** Format: uint32 */
            page?: number | null;
            /**
             * @default null
             * @enum {string|null}
             */
            sortDirection: "asc" | "desc" | null;
            tree?: string | null;
        };
        /** TransactionSignatureList */
        TransactionSignatureList: {
            after?: string | null;
            before?: string | null;
            /** @default [] */
            items: [
                string,
                string
            ][];
            /**
             * Format: uint32
             * @default 0
             */
            limit: number;
            /** Format: uint32 */
            page?: number | null;
            /**
             * Format: uint32
             * @default 0
             */
            total: number;
        };
        /** GetGrouping */
        GetGrouping: {
            groupKey: string;
            groupValue: string;
        };
        /** GetGroupingResponse */
        GetGroupingResponse: {
            /** @default  */
            group_key: string;
            /** @default  */
            group_name: string;
            /**
             * Format: uint64
             * @default 0
             */
            group_size: number;
        };
        /** GetTokenAccounts */
        GetTokenAccounts: {
            after?: string | null;
            before?: string | null;
            /** @default null */
            cursor: string | null;
            /** Format: uint32 */
            limit?: number | null;
            mintAddress?: string | null;
            /** @default null */
            options: {
                /** @default false */
                showCollectionMetadata: boolean;
                /** @default false */
                showFungible: boolean;
                /** @default false */
                showInscription: boolean;
                /** @default false */
                showUnverifiedCollections: boolean;
                /** @default false */
                showZeroBalance: boolean;
            } | null;
            ownerAddress?: string | null;
            /** Format: uint32 */
            page?: number | null;
        };
        /** TokenAccountList */
        TokenAccountList: {
            after?: string | null;
            before?: string | null;
            /** @default null */
            cursor: string | null;
            /** @default [] */
            errors: {
                /** @default  */
                error: string;
                /** @default  */
                id: string;
            }[];
            /**
             * Format: uint32
             * @default 0
             */
            limit: number;
            /** Format: uint32 */
            page?: number | null;
            /** @default [] */
            token_accounts: {
                /** @default  */
                address: string;
                /**
                 * Format: uint64
                 * @default 0
                 */
                amount: number;
                /** @default null */
                close_authority: string | null;
                /** @default null */
                delegate: string | null;
                /**
                 * Format: uint64
                 * @default 0
                 */
                delegated_amount: number;
                /** @default null */
                extensions: unknown;
                /** @default false */
                frozen: boolean;
                /** @default  */
                mint: string;
                /** @default  */
                owner: string;
            }[];
            /**
             * Format: uint32
             * @default 0
             */
            total: number;
        };
        /** GetNftEditions */
        GetNftEditions: {
            after?: string | null;
            before?: string | null;
            /** @default null */
            cursor: string | null;
            /** Format: uint32 */
            limit?: number | null;
            mintAddress: string;
            /** Format: uint32 */
            page?: number | null;
        };
        /** NftEditions */
        NftEditions: {
            after?: string | null;
            before?: string | null;
            cursor?: string | null;
            editions?: {
                /** @default  */
                edition_address: string;
                /**
                 * Format: uint64
                 * @default 0
                 */
                edition_number: number;
                /** @default  */
                mint_address: string;
            }[];
            /**
             * Format: uint32
             * @default 0
             */
            limit: number;
            /** @default  */
            master_edition_address: string;
            /**
             * Format: uint64
             * @default null
             */
            max_supply: number | null;
            /** Format: uint32 */
            page?: number | null;
            /**
             * Format: uint64
             * @default 0
             */
            supply: number;
            /**
             * Format: uint32
             * @default 0
             */
            total: number;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
