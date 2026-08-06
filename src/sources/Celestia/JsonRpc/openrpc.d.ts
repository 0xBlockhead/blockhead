export type paths = Record<string, never>;
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @example 42 */
        blob_Get_Param0_height: number;
        /** @example AAAAAAAAAAAAAAAAAAAAAAAAAAAAAMJ/xGlNMdE= */
        blob_Get_Param1_namespace: Record<string, never>;
        /** @example aHlbp+J9yub6hw/uhK6dP8hBLR2mFy78XNRRdLf2794= */
        blob_Get_Param2_commitment: string;
        /**
         * @example {
         *       "namespace": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAMJ/xGlNMdE=",
         *       "data": "z8QyNztvogN7NYU27gI+nJgg1vMJtkK3vbduSDz7/8mhmos37I7duH51kkgouxrsdhdOBJ1431OmipNfVedbtwe6zQ06EbJBl/jk4QwwU3S29YBTUZcUfTzXpEJIuMrYzU6YPxN8Zce/KNdsEIy4zxdfxekXpvsgZMBhf83iYgfHvsFAoJmmCp/ORAUoAFf7tJ7cF8RZyA20ftqRa1uhAmktxIb58abpGTG+TNgq3mjyvswECVykJYqGjqNtInyIx2EQOnVp2q69YHkegdoBvoOKzEFigQTdrL2TZBex4MhkrYt7Zf0DQyNMRkCPL/zKYE3bhvXNWMThWCmhD5TOApzirORXKOTB0nxhjDF/aFYkrS+IKBw1KfJ5isldWvmasJBWwRgDuli6Cty67vMMk7fUUTUf0St6rvQeftSoEVlC1xEw46+h5kIXaWiM0g/EzGIAdZHycUFWCSdnt3p7BS5ttEpSf1d6ZbVYYL2y0XguH41k54JqufEMAw9ukmaF0IbN9Jk6fNefV1dsWTdCP6Mz6e+RTCd9DQGqb2VrsvMzx5uVidLD8ND79pvXgL1VzyhJaMTcjSfZK15jOxLwGh1arZc2gyTNiq2pu6wNz0tdJp+fFU+peG8rHN8=",
         *       "share_version": 0,
         *       "commitment": "aHlbp+J9yub6hw/uhK6dP8hBLR2mFy78XNRRdLf2794=",
         *       "index": -1
         *     }
         */
        blob_Get_Result: {
            blob?: unknown;
            commitment?: string;
        };
        /** @example 42 */
        blob_GetAll_Param0_height: number;
        /**
         * @example [
         *       "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAMJ/xGlNMdE="
         *     ]
         */
        blob_GetAll_Param1_namespaces: [
            Record<string, never>
        ];
        /**
         * @example [
         *       {
         *         "namespace": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAMJ/xGlNMdE=",
         *         "data": "z8QyNztvogN7NYU27gI+nJgg1vMJtkK3vbduSDz7/8mhmos37I7duH51kkgouxrsdhdOBJ1431OmipNfVedbtwe6zQ06EbJBl/jk4QwwU3S29YBTUZcUfTzXpEJIuMrYzU6YPxN8Zce/KNdsEIy4zxdfxekXpvsgZMBhf83iYgfHvsFAoJmmCp/ORAUoAFf7tJ7cF8RZyA20ftqRa1uhAmktxIb58abpGTG+TNgq3mjyvswECVykJYqGjqNtInyIx2EQOnVp2q69YHkegdoBvoOKzEFigQTdrL2TZBex4MhkrYt7Zf0DQyNMRkCPL/zKYE3bhvXNWMThWCmhD5TOApzirORXKOTB0nxhjDF/aFYkrS+IKBw1KfJ5isldWvmasJBWwRgDuli6Cty67vMMk7fUUTUf0St6rvQeftSoEVlC1xEw46+h5kIXaWiM0g/EzGIAdZHycUFWCSdnt3p7BS5ttEpSf1d6ZbVYYL2y0XguH41k54JqufEMAw9ukmaF0IbN9Jk6fNefV1dsWTdCP6Mz6e+RTCd9DQGqb2VrsvMzx5uVidLD8ND79pvXgL1VzyhJaMTcjSfZK15jOxLwGh1arZc2gyTNiq2pu6wNz0tdJp+fFU+peG8rHN8=",
         *         "share_version": 0,
         *         "commitment": "aHlbp+J9yub6hw/uhK6dP8hBLR2mFy78XNRRdLf2794=",
         *         "index": -1
         *       }
         *     ]
         */
        blob_GetAll_Result: [
            {
                blob?: {
                    blob?: unknown;
                    commitment?: string;
                };
                commitment?: string;
            }
        ];
        /** @example 42 */
        blob_GetCommitmentProof_Param0_height: number;
        /** @example AAAAAAAAAAAAAAAAAAAAAAAAAAAAAMJ/xGlNMdE= */
        blob_GetCommitmentProof_Param1_namespace: Record<string, never>;
        /** @example Ynl0ZSBhcnJheQ== */
        blob_GetCommitmentProof_Param2_shareCommitment: string;
        /**
         * @example {
         *       "subtree_roots": [
         *         "Ynl0ZSBhcnJheQ=="
         *       ],
         *       "subtree_root_proofs": [
         *         {}
         *       ],
         *       "namespace_id": "Bw==",
         *       "row_proof": {
         *         "row_roots": [
         *           "Ynl0ZSBhcnJheQ=="
         *         ],
         *         "proofs": [
         *           {
         *             "total": "42",
         *             "index": "42",
         *             "leaf_hash": "Ynl0ZSBhcnJheQ==",
         *             "aunts": [
         *               "Ynl0ZSBhcnJheQ=="
         *             ]
         *           }
         *         ],
         *         "root": "Ynl0ZSBhcnJheQ==",
         *         "start_row": 42,
         *         "end_row": 42
         *       },
         *       "namespace_version": 7
         *     }
         */
        blob_GetCommitmentProof_Result: {
            namespace_id?: string;
            namespace_version?: number;
            row_proof?: {
                end_row?: number;
                proofs?: Record<string, never>[];
                root?: string;
                row_roots?: string[];
                start_row?: number;
            };
            subtree_root_proofs?: Record<string, never>[];
            subtree_roots?: string[];
        };
        /** @example 42 */
        blob_GetProof_Param0_height: number;
        /** @example AAAAAAAAAAAAAAAAAAAAAAAAAAAAAMJ/xGlNMdE= */
        blob_GetProof_Param1_namespace: Record<string, never>;
        /** @example aHlbp+J9yub6hw/uhK6dP8hBLR2mFy78XNRRdLf2794= */
        blob_GetProof_Param2_commitment: string;
        /**
         * @example [
         *       {
         *         "end": 8,
         *         "nodes": [
         *           "/////////////////////////////////////////////////////////////////////////////wuxStDHcZ7+b5byNQMVLJbzBT3wmObsThoQ0sCTjTCP"
         *         ],
         *         "is_max_namespace_ignored": true
         *       },
         *       {
         *         "end": 8,
         *         "nodes": [
         *           "//////////////////////////////////////////////////////////////////////////////n1NeJxPU2bZUAccKZZ+LAu2Wj5ajbVYURV9ojhSKwp"
         *         ],
         *         "is_max_namespace_ignored": true
         *       },
         *       {
         *         "end": 8,
         *         "nodes": [
         *           "/////////////////////////////////////////////////////////////////////////////0xK8BKnzDmwK0HR4ZJvyB4kh3jPPXGxaGPFoga8vPxF"
         *         ],
         *         "is_max_namespace_ignored": true
         *       },
         *       {
         *         "end": 7,
         *         "nodes": [
         *           "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAMJ/xGlNMdEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwn/EaU0x0UTO9HUGKjyjcv5U2gHeSjJ8S1rftqv6k8kxlVWW8e/7",
         *           "/////////////////////////////////////////////////////////////////////////////wexh4khLQ9HQ2X6nh9wU5B+m6r+LWwPTEDTa5/CosDF"
         *         ],
         *         "is_max_namespace_ignored": true
         *       }
         *     ]
         */
        blob_GetProof_Result: [
            Record<string, never>
        ];
        /** @example 42 */
        blob_Included_Param0_height: number;
        /** @example AAAAAAAAAAAAAAAAAAAAAAAAAAAAAMJ/xGlNMdE= */
        blob_Included_Param1_namespace: Record<string, never>;
        /**
         * @example [
         *       {
         *         "end": 8,
         *         "nodes": [
         *           "/////////////////////////////////////////////////////////////////////////////wuxStDHcZ7+b5byNQMVLJbzBT3wmObsThoQ0sCTjTCP"
         *         ],
         *         "is_max_namespace_ignored": true
         *       },
         *       {
         *         "end": 8,
         *         "nodes": [
         *           "//////////////////////////////////////////////////////////////////////////////n1NeJxPU2bZUAccKZZ+LAu2Wj5ajbVYURV9ojhSKwp"
         *         ],
         *         "is_max_namespace_ignored": true
         *       },
         *       {
         *         "end": 8,
         *         "nodes": [
         *           "/////////////////////////////////////////////////////////////////////////////0xK8BKnzDmwK0HR4ZJvyB4kh3jPPXGxaGPFoga8vPxF"
         *         ],
         *         "is_max_namespace_ignored": true
         *       },
         *       {
         *         "end": 7,
         *         "nodes": [
         *           "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAMJ/xGlNMdEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwn/EaU0x0UTO9HUGKjyjcv5U2gHeSjJ8S1rftqv6k8kxlVWW8e/7",
         *           "/////////////////////////////////////////////////////////////////////////////wexh4khLQ9HQ2X6nh9wU5B+m6r+LWwPTEDTa5/CosDF"
         *         ],
         *         "is_max_namespace_ignored": true
         *       }
         *     ]
         */
        blob_Included_Param2_proof: [
            Record<string, never>
        ];
        /** @example aHlbp+J9yub6hw/uhK6dP8hBLR2mFy78XNRRdLf2794= */
        blob_Included_Param3_commitment: string;
        /** @example true */
        blob_Included_Result: boolean;
        /**
         * @example [
         *       {
         *         "namespace": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAMJ/xGlNMdE=",
         *         "data": "z8QyNztvogN7NYU27gI+nJgg1vMJtkK3vbduSDz7/8mhmos37I7duH51kkgouxrsdhdOBJ1431OmipNfVedbtwe6zQ06EbJBl/jk4QwwU3S29YBTUZcUfTzXpEJIuMrYzU6YPxN8Zce/KNdsEIy4zxdfxekXpvsgZMBhf83iYgfHvsFAoJmmCp/ORAUoAFf7tJ7cF8RZyA20ftqRa1uhAmktxIb58abpGTG+TNgq3mjyvswECVykJYqGjqNtInyIx2EQOnVp2q69YHkegdoBvoOKzEFigQTdrL2TZBex4MhkrYt7Zf0DQyNMRkCPL/zKYE3bhvXNWMThWCmhD5TOApzirORXKOTB0nxhjDF/aFYkrS+IKBw1KfJ5isldWvmasJBWwRgDuli6Cty67vMMk7fUUTUf0St6rvQeftSoEVlC1xEw46+h5kIXaWiM0g/EzGIAdZHycUFWCSdnt3p7BS5ttEpSf1d6ZbVYYL2y0XguH41k54JqufEMAw9ukmaF0IbN9Jk6fNefV1dsWTdCP6Mz6e+RTCd9DQGqb2VrsvMzx5uVidLD8ND79pvXgL1VzyhJaMTcjSfZK15jOxLwGh1arZc2gyTNiq2pu6wNz0tdJp+fFU+peG8rHN8=",
         *         "share_version": 0,
         *         "commitment": "aHlbp+J9yub6hw/uhK6dP8hBLR2mFy78XNRRdLf2794=",
         *         "index": -1
         *       }
         *     ]
         */
        blob_Submit_Param0_blobs: [
            {
                blob?: {
                    blob?: unknown;
                    commitment?: string;
                };
                commitment?: string;
            }
        ];
        /**
         * @example {
         *       "gas_price": 0.002,
         *       "is_gas_price_set": true,
         *       "max_gas_price": 0.4,
         *       "gas": 142225,
         *       "tx_priority": 1,
         *       "key_name": "my_celes_key",
         *       "signer_address": "celestia1pjcmwj8w6hyr2c4wehakc5g8cfs36aysgucx66",
         *       "fee_granter_address": "celestia1hakc56ax66ypjcmwj8w6hyr2c4g8cfs3wesguc"
         *     }
         */
        blob_Submit_Param1_options: Record<string, never>;
        /** @example 42 */
        blob_Submit_Result: number;
        /** @example AAAAAAAAAAAAAAAAAAAAAAAAAAAAAMJ/xGlNMdE= */
        blob_Subscribe_Param0_namespace: Record<string, never>;
        /** typeUnsupportedByJSONSchema */
        typeUnsupportedByJSONSchema: Record<string, never>;
        /** @example 42 */
        blobstream_GetDataRootTupleInclusionProof_Param0_height: number;
        /** @example 42 */
        blobstream_GetDataRootTupleInclusionProof_Param1_start: number;
        /** @example 42 */
        blobstream_GetDataRootTupleInclusionProof_Param2_end: number;
        /**
         * @example {
         *       "total": 42,
         *       "index": 42,
         *       "leaf_hash": "Ynl0ZSBhcnJheQ==",
         *       "aunts": [
         *         "Ynl0ZSBhcnJheQ=="
         *       ]
         *     }
         */
        blobstream_GetDataRootTupleInclusionProof_Result: {
            aunts?: string[];
            index?: number;
            leaf_hash?: string;
            total?: number;
        };
        /** @example 42 */
        blobstream_GetDataRootTupleRoot_Param0_start: number;
        /** @example 42 */
        blobstream_GetDataRootTupleRoot_Param1_end: number;
        /** @example 453D0BC3CB88A2ED6F2E06021383B22C72D25D7741AE51B4CAE1AD34D72A3F07 */
        blobstream_GetDataRootTupleRoot_Result: string;
        /**
         * @example [
         *       "Ynl0ZSBhcnJheQ=="
         *     ]
         */
        da_Commit_Param0_blobs: [
            string
        ];
        /** @example Ynl0ZSBhcnJheQ== */
        da_Commit_Param1_ns: string;
        /**
         * @example [
         *       "Ynl0ZSBhcnJheQ=="
         *     ]
         */
        da_Commit_Result: [
            string
        ];
        /**
         * @example [
         *       "Ynl0ZSBhcnJheQ=="
         *     ]
         */
        da_Get_Param0_ids: [
            string
        ];
        /** @example Ynl0ZSBhcnJheQ== */
        da_Get_Param1_ns: string;
        /**
         * @example [
         *       "Ynl0ZSBhcnJheQ=="
         *     ]
         */
        da_Get_Result: [
            string
        ];
        /** @example 42 */
        da_GetIDs_Param0_height: number;
        /** @example Ynl0ZSBhcnJheQ== */
        da_GetIDs_Param1_ns: string;
        /**
         * @example {
         *       "IDs": [
         *         "Ynl0ZSBhcnJheQ=="
         *       ],
         *       "Timestamp": "0001-01-01T00:00:00Z"
         *     }
         */
        da_GetIDs_Result: {
            IDs?: string[];
            /** Format: date-time */
            Timestamp?: string;
        };
        /**
         * @example [
         *       "Ynl0ZSBhcnJheQ=="
         *     ]
         */
        da_GetProofs_Param0_ids: [
            string
        ];
        /** @example Ynl0ZSBhcnJheQ== */
        da_GetProofs_Param1_ns: string;
        /**
         * @example [
         *       "Ynl0ZSBhcnJheQ=="
         *     ]
         */
        da_GetProofs_Result: [
            string
        ];
        /** @example 42 */
        da_MaxBlobSize_Result: number;
        /**
         * @example [
         *       "Ynl0ZSBhcnJheQ=="
         *     ]
         */
        da_Submit_Param0_blobs: [
            string
        ];
        /** @example 42 */
        da_Submit_Param1_gasPrice: number;
        /** @example Ynl0ZSBhcnJheQ== */
        da_Submit_Param2_ns: string;
        /**
         * @example [
         *       "Ynl0ZSBhcnJheQ=="
         *     ]
         */
        da_Submit_Result: [
            string
        ];
        /**
         * @example [
         *       "Ynl0ZSBhcnJheQ=="
         *     ]
         */
        da_SubmitWithOptions_Param0_blobs: [
            string
        ];
        /** @example 42 */
        da_SubmitWithOptions_Param1_gasPrice: number;
        /** @example Ynl0ZSBhcnJheQ== */
        da_SubmitWithOptions_Param2_ns: string;
        /** @example Ynl0ZSBhcnJheQ== */
        da_SubmitWithOptions_Param3_options: string;
        /**
         * @example [
         *       "Ynl0ZSBhcnJheQ=="
         *     ]
         */
        da_SubmitWithOptions_Result: [
            string
        ];
        /**
         * @example [
         *       "Ynl0ZSBhcnJheQ=="
         *     ]
         */
        da_Validate_Param0_ids: [
            string
        ];
        /**
         * @example [
         *       "Ynl0ZSBhcnJheQ=="
         *     ]
         */
        da_Validate_Param1_proofs: [
            string
        ];
        /** @example Ynl0ZSBhcnJheQ== */
        da_Validate_Param2_ns: string;
        /**
         * @example [
         *       true
         *     ]
         */
        da_Validate_Result: [
            boolean
        ];
        /**
         * @example {
         *       "head_of_sampled_chain": 1092,
         *       "head_of_catchup": 34101,
         *       "network_head_height": 470292,
         *       "workers": [
         *         {
         *           "job_type": "catchup",
         *           "current": 1093,
         *           "from": 1002,
         *           "to": 1101
         *         },
         *         {
         *           "job_type": "catchup",
         *           "current": 33343,
         *           "from": 33302,
         *           "to": 33401
         *         },
         *         {
         *           "job_type": "catchup",
         *           "current": 34047,
         *           "from": 34002,
         *           "to": 34101
         *         },
         *         {
         *           "job_type": "catchup",
         *           "current": 1327,
         *           "from": 1302,
         *           "to": 1401
         *         },
         *         {
         *           "job_type": "catchup",
         *           "current": 1197,
         *           "from": 1102,
         *           "to": 1201
         *         },
         *         {
         *           "job_type": "catchup",
         *           "current": 1408,
         *           "from": 1402,
         *           "to": 1501
         *         }
         *       ],
         *       "concurrency": 6,
         *       "catch_up_done": false,
         *       "is_running": true
         *     }
         */
        das_SamplingStats_Result: {
            catch_up_done?: boolean;
            concurrency?: number;
            failed?: {
                [key: string]: number;
            };
            head_of_catchup?: number;
            head_of_sampled_chain?: number;
            is_running?: boolean;
            network_head_height?: number;
            workers?: {
                current?: number;
                error?: string;
                from?: number;
                job_type?: string;
                to?: number;
            }[];
        };
        das_WaitCatchUp_Result: null;
        /** @example badencodingv0.1 */
        fraud_Get_Param0_proofType: string;
        /**
         * @example [
         *       {
         *         "proof_type": "badencodingv0.1",
         *         "data": "ChJiYWQgZW5jb2RpbmcgcHJvb2YQKg=="
         *       }
         *     ]
         */
        fraud_Get_Result: [
            Record<string, never>
        ];
        /** @example badencodingv0.1 */
        fraud_Subscribe_Param0_proofType: string;
        /** @example 453D0BC3CB88A2ED6F2E06021383B22C72D25D7741AE51B4CAE1AD34D72A3F07 */
        header_GetByHash_Param0_hash: string;
        /**
         * @example {
         *       "header": {
         *         "version": {
         *           "block": "11"
         *         },
         *         "chain_id": "arabica-6",
         *         "height": "67374",
         *         "time": "2023-02-25T12:10:28.067566292Z",
         *         "last_block_id": {
         *           "hash": "47A2C7758760988500B2F043D3903BBBF1C8B383CA33CF7056AA45E22055663E",
         *           "parts": {
         *             "total": 1,
         *             "hash": "33B012F244E27672169DD3D62CDBC92DA9486E410A5530F41FE6A890D8E2EE42"
         *           }
         *         },
         *         "last_commit_hash": "888D47F5E9473501C99F2B6136B6B9FFBC9D1CD2F54002BCD5DF002FFEF0A83D",
         *         "data_hash": "257760461993F8F197B421EC7435F3C36C3734923E3DA9A42DC73B05F07B3D08",
         *         "validators_hash": "883A0C92B8D976312B249C1397E73CF2981A9EB715717CBEE3800B8380C22C1D",
         *         "next_validators_hash": "883A0C92B8D976312B249C1397E73CF2981A9EB715717CBEE3800B8380C22C1D",
         *         "consensus_hash": "048091BC7DDC283F77BFBF91D73C44DA58C3DF8A9CBC867405D8B7F3DAADA22F",
         *         "app_hash": "1FC70854A185737C7FD720FCCE9167876EE4B9ABE23DB1EBB8C552D3E3978435",
         *         "last_results_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
         *         "evidence_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
         *         "proposer_address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA"
         *       },
         *       "commit": {
         *         "height": "67374",
         *         "round": 0,
         *         "block_id": {
         *           "hash": "A7F6B1CF33313121539206754A73FDC22ADA48C4AA8C4BB4F707ED2E089E59D3",
         *           "parts": {
         *             "total": 1,
         *             "hash": "6634FE1E1DDDCB9914ACE81F146013986F5FDA03A8F1C16DC5ECA0D9B0E08FBC"
         *           }
         *         },
         *         "signatures": [
         *           {
         *             "block_id_flag": 2,
         *             "validator_address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *             "timestamp": "2023-02-25T12:10:38.130121476Z",
         *             "signature": "HyR/uRIUNc5GNqQteZyrVjJM47SI9sRAgrLsNqJDls3AzbvHUfN4zzWyw0afyEvNm98Bm2GIoJoZC5D8oQvdBA=="
         *           }
         *         ]
         *       },
         *       "validator_set": {
         *         "validators": [
         *           {
         *             "address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *             "pub_key": {
         *               "type": "tendermint/PubKeyEd25519",
         *               "value": "aoB4xU9//HAqOP9ciyp0+PTdZxt/UGKgZOabU6JxW8o="
         *             },
         *             "voting_power": "5000000000",
         *             "proposer_priority": "0"
         *           }
         *         ],
         *         "proposer": {
         *           "address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *           "pub_key": {
         *             "type": "tendermint/PubKeyEd25519",
         *             "value": "aoB4xU9//HAqOP9ciyp0+PTdZxt/UGKgZOabU6JxW8o="
         *           },
         *           "voting_power": "5000000000",
         *           "proposer_priority": "0"
         *         }
         *       },
         *       "dah": {
         *         "row_roots": [
         *           "//////////7//////////ql+/VFmJ8PWE9BcjrTDLrY/hzVeGdzFCpfEhiXDXZmt",
         *           "/////////////////////zHeGnUtPJn8QyPpePSYl4qRVrcUvG2fwptyoA85Myik"
         *         ],
         *         "column_roots": [
         *           "//////////7//////////ql+/VFmJ8PWE9BcjrTDLrY/hzVeGdzFCpfEhiXDXZmt",
         *           "/////////////////////zHeGnUtPJn8QyPpePSYl4qRVrcUvG2fwptyoA85Myik"
         *         ]
         *       }
         *     }
         */
        header_GetByHash_Result: {
            commit?: {
                block_id?: {
                    hash?: string;
                    parts?: {
                        hash?: string;
                        total?: number;
                    };
                };
                height?: number;
                round?: number;
                signatures?: {
                    block_id_flag?: number;
                    signature?: string;
                    /** Format: date-time */
                    timestamp?: string;
                    validator_address?: string;
                }[];
            };
            dah?: {
                column_roots?: string[];
                row_roots?: string[];
            };
            header?: {
                app_hash?: string;
                chain_id?: string;
                consensus_hash?: string;
                data_hash?: string;
                evidence_hash?: string;
                height?: number;
                last_block_id?: {
                    hash?: string;
                    parts?: {
                        hash?: string;
                        total?: number;
                    };
                };
                last_commit_hash?: string;
                last_results_hash?: string;
                next_validators_hash?: string;
                proposer_address?: string;
                /** Format: date-time */
                time?: string;
                validators_hash?: string;
                version?: {
                    app?: number;
                    block?: number;
                };
            };
            validator_set?: {
                proposer?: {
                    address?: string;
                    proposer_priority?: number;
                    pub_key?: {
                        [key: string]: unknown;
                    };
                    voting_power?: number;
                };
                validators?: {
                    address?: string;
                    proposer_priority?: number;
                    pub_key?: {
                        [key: string]: unknown;
                    };
                    voting_power?: number;
                }[];
            };
        };
        /** @example 42 */
        header_GetByHeight_Param0_u: number;
        /**
         * @example {
         *       "header": {
         *         "version": {
         *           "block": "11"
         *         },
         *         "chain_id": "arabica-6",
         *         "height": "67374",
         *         "time": "2023-02-25T12:10:28.067566292Z",
         *         "last_block_id": {
         *           "hash": "47A2C7758760988500B2F043D3903BBBF1C8B383CA33CF7056AA45E22055663E",
         *           "parts": {
         *             "total": 1,
         *             "hash": "33B012F244E27672169DD3D62CDBC92DA9486E410A5530F41FE6A890D8E2EE42"
         *           }
         *         },
         *         "last_commit_hash": "888D47F5E9473501C99F2B6136B6B9FFBC9D1CD2F54002BCD5DF002FFEF0A83D",
         *         "data_hash": "257760461993F8F197B421EC7435F3C36C3734923E3DA9A42DC73B05F07B3D08",
         *         "validators_hash": "883A0C92B8D976312B249C1397E73CF2981A9EB715717CBEE3800B8380C22C1D",
         *         "next_validators_hash": "883A0C92B8D976312B249C1397E73CF2981A9EB715717CBEE3800B8380C22C1D",
         *         "consensus_hash": "048091BC7DDC283F77BFBF91D73C44DA58C3DF8A9CBC867405D8B7F3DAADA22F",
         *         "app_hash": "1FC70854A185737C7FD720FCCE9167876EE4B9ABE23DB1EBB8C552D3E3978435",
         *         "last_results_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
         *         "evidence_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
         *         "proposer_address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA"
         *       },
         *       "commit": {
         *         "height": "67374",
         *         "round": 0,
         *         "block_id": {
         *           "hash": "A7F6B1CF33313121539206754A73FDC22ADA48C4AA8C4BB4F707ED2E089E59D3",
         *           "parts": {
         *             "total": 1,
         *             "hash": "6634FE1E1DDDCB9914ACE81F146013986F5FDA03A8F1C16DC5ECA0D9B0E08FBC"
         *           }
         *         },
         *         "signatures": [
         *           {
         *             "block_id_flag": 2,
         *             "validator_address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *             "timestamp": "2023-02-25T12:10:38.130121476Z",
         *             "signature": "HyR/uRIUNc5GNqQteZyrVjJM47SI9sRAgrLsNqJDls3AzbvHUfN4zzWyw0afyEvNm98Bm2GIoJoZC5D8oQvdBA=="
         *           }
         *         ]
         *       },
         *       "validator_set": {
         *         "validators": [
         *           {
         *             "address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *             "pub_key": {
         *               "type": "tendermint/PubKeyEd25519",
         *               "value": "aoB4xU9//HAqOP9ciyp0+PTdZxt/UGKgZOabU6JxW8o="
         *             },
         *             "voting_power": "5000000000",
         *             "proposer_priority": "0"
         *           }
         *         ],
         *         "proposer": {
         *           "address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *           "pub_key": {
         *             "type": "tendermint/PubKeyEd25519",
         *             "value": "aoB4xU9//HAqOP9ciyp0+PTdZxt/UGKgZOabU6JxW8o="
         *           },
         *           "voting_power": "5000000000",
         *           "proposer_priority": "0"
         *         }
         *       },
         *       "dah": {
         *         "row_roots": [
         *           "//////////7//////////ql+/VFmJ8PWE9BcjrTDLrY/hzVeGdzFCpfEhiXDXZmt",
         *           "/////////////////////zHeGnUtPJn8QyPpePSYl4qRVrcUvG2fwptyoA85Myik"
         *         ],
         *         "column_roots": [
         *           "//////////7//////////ql+/VFmJ8PWE9BcjrTDLrY/hzVeGdzFCpfEhiXDXZmt",
         *           "/////////////////////zHeGnUtPJn8QyPpePSYl4qRVrcUvG2fwptyoA85Myik"
         *         ]
         *       }
         *     }
         */
        header_GetByHeight_Result: {
            commit?: {
                block_id?: {
                    hash?: string;
                    parts?: {
                        hash?: string;
                        total?: number;
                    };
                };
                height?: number;
                round?: number;
                signatures?: {
                    block_id_flag?: number;
                    signature?: string;
                    /** Format: date-time */
                    timestamp?: string;
                    validator_address?: string;
                }[];
            };
            dah?: {
                column_roots?: string[];
                row_roots?: string[];
            };
            header?: {
                app_hash?: string;
                chain_id?: string;
                consensus_hash?: string;
                data_hash?: string;
                evidence_hash?: string;
                height?: number;
                last_block_id?: {
                    hash?: string;
                    parts?: {
                        hash?: string;
                        total?: number;
                    };
                };
                last_commit_hash?: string;
                last_results_hash?: string;
                next_validators_hash?: string;
                proposer_address?: string;
                /** Format: date-time */
                time?: string;
                validators_hash?: string;
                version?: {
                    app?: number;
                    block?: number;
                };
            };
            validator_set?: {
                proposer?: {
                    address?: string;
                    proposer_priority?: number;
                    pub_key?: {
                        [key: string]: unknown;
                    };
                    voting_power?: number;
                };
                validators?: {
                    address?: string;
                    proposer_priority?: number;
                    pub_key?: {
                        [key: string]: unknown;
                    };
                    voting_power?: number;
                }[];
            };
        };
        /**
         * @example {
         *       "header": {
         *         "version": {
         *           "block": "11"
         *         },
         *         "chain_id": "arabica-6",
         *         "height": "67374",
         *         "time": "2023-02-25T12:10:28.067566292Z",
         *         "last_block_id": {
         *           "hash": "47A2C7758760988500B2F043D3903BBBF1C8B383CA33CF7056AA45E22055663E",
         *           "parts": {
         *             "total": 1,
         *             "hash": "33B012F244E27672169DD3D62CDBC92DA9486E410A5530F41FE6A890D8E2EE42"
         *           }
         *         },
         *         "last_commit_hash": "888D47F5E9473501C99F2B6136B6B9FFBC9D1CD2F54002BCD5DF002FFEF0A83D",
         *         "data_hash": "257760461993F8F197B421EC7435F3C36C3734923E3DA9A42DC73B05F07B3D08",
         *         "validators_hash": "883A0C92B8D976312B249C1397E73CF2981A9EB715717CBEE3800B8380C22C1D",
         *         "next_validators_hash": "883A0C92B8D976312B249C1397E73CF2981A9EB715717CBEE3800B8380C22C1D",
         *         "consensus_hash": "048091BC7DDC283F77BFBF91D73C44DA58C3DF8A9CBC867405D8B7F3DAADA22F",
         *         "app_hash": "1FC70854A185737C7FD720FCCE9167876EE4B9ABE23DB1EBB8C552D3E3978435",
         *         "last_results_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
         *         "evidence_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
         *         "proposer_address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA"
         *       },
         *       "commit": {
         *         "height": "67374",
         *         "round": 0,
         *         "block_id": {
         *           "hash": "A7F6B1CF33313121539206754A73FDC22ADA48C4AA8C4BB4F707ED2E089E59D3",
         *           "parts": {
         *             "total": 1,
         *             "hash": "6634FE1E1DDDCB9914ACE81F146013986F5FDA03A8F1C16DC5ECA0D9B0E08FBC"
         *           }
         *         },
         *         "signatures": [
         *           {
         *             "block_id_flag": 2,
         *             "validator_address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *             "timestamp": "2023-02-25T12:10:38.130121476Z",
         *             "signature": "HyR/uRIUNc5GNqQteZyrVjJM47SI9sRAgrLsNqJDls3AzbvHUfN4zzWyw0afyEvNm98Bm2GIoJoZC5D8oQvdBA=="
         *           }
         *         ]
         *       },
         *       "validator_set": {
         *         "validators": [
         *           {
         *             "address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *             "pub_key": {
         *               "type": "tendermint/PubKeyEd25519",
         *               "value": "aoB4xU9//HAqOP9ciyp0+PTdZxt/UGKgZOabU6JxW8o="
         *             },
         *             "voting_power": "5000000000",
         *             "proposer_priority": "0"
         *           }
         *         ],
         *         "proposer": {
         *           "address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *           "pub_key": {
         *             "type": "tendermint/PubKeyEd25519",
         *             "value": "aoB4xU9//HAqOP9ciyp0+PTdZxt/UGKgZOabU6JxW8o="
         *           },
         *           "voting_power": "5000000000",
         *           "proposer_priority": "0"
         *         }
         *       },
         *       "dah": {
         *         "row_roots": [
         *           "//////////7//////////ql+/VFmJ8PWE9BcjrTDLrY/hzVeGdzFCpfEhiXDXZmt",
         *           "/////////////////////zHeGnUtPJn8QyPpePSYl4qRVrcUvG2fwptyoA85Myik"
         *         ],
         *         "column_roots": [
         *           "//////////7//////////ql+/VFmJ8PWE9BcjrTDLrY/hzVeGdzFCpfEhiXDXZmt",
         *           "/////////////////////zHeGnUtPJn8QyPpePSYl4qRVrcUvG2fwptyoA85Myik"
         *         ]
         *       }
         *     }
         */
        header_GetRangeByHeight_Param0_from: {
            commit?: {
                block_id?: {
                    hash?: string;
                    parts?: {
                        hash?: string;
                        total?: number;
                    };
                };
                height?: number;
                round?: number;
                signatures?: {
                    block_id_flag?: number;
                    signature?: string;
                    /** Format: date-time */
                    timestamp?: string;
                    validator_address?: string;
                }[];
            };
            dah?: {
                column_roots?: string[];
                row_roots?: string[];
            };
            header?: {
                app_hash?: string;
                chain_id?: string;
                consensus_hash?: string;
                data_hash?: string;
                evidence_hash?: string;
                height?: number;
                last_block_id?: {
                    hash?: string;
                    parts?: {
                        hash?: string;
                        total?: number;
                    };
                };
                last_commit_hash?: string;
                last_results_hash?: string;
                next_validators_hash?: string;
                proposer_address?: string;
                /** Format: date-time */
                time?: string;
                validators_hash?: string;
                version?: {
                    app?: number;
                    block?: number;
                };
            };
            validator_set?: {
                proposer?: {
                    address?: string;
                    proposer_priority?: number;
                    pub_key?: {
                        [key: string]: unknown;
                    };
                    voting_power?: number;
                };
                validators?: {
                    address?: string;
                    proposer_priority?: number;
                    pub_key?: {
                        [key: string]: unknown;
                    };
                    voting_power?: number;
                }[];
            };
        };
        /** @example 42 */
        header_GetRangeByHeight_Param1_to: number;
        /**
         * @example [
         *       {
         *         "header": {
         *           "version": {
         *             "block": "11"
         *           },
         *           "chain_id": "arabica-6",
         *           "height": "67374",
         *           "time": "2023-02-25T12:10:28.067566292Z",
         *           "last_block_id": {
         *             "hash": "47A2C7758760988500B2F043D3903BBBF1C8B383CA33CF7056AA45E22055663E",
         *             "parts": {
         *               "total": 1,
         *               "hash": "33B012F244E27672169DD3D62CDBC92DA9486E410A5530F41FE6A890D8E2EE42"
         *             }
         *           },
         *           "last_commit_hash": "888D47F5E9473501C99F2B6136B6B9FFBC9D1CD2F54002BCD5DF002FFEF0A83D",
         *           "data_hash": "257760461993F8F197B421EC7435F3C36C3734923E3DA9A42DC73B05F07B3D08",
         *           "validators_hash": "883A0C92B8D976312B249C1397E73CF2981A9EB715717CBEE3800B8380C22C1D",
         *           "next_validators_hash": "883A0C92B8D976312B249C1397E73CF2981A9EB715717CBEE3800B8380C22C1D",
         *           "consensus_hash": "048091BC7DDC283F77BFBF91D73C44DA58C3DF8A9CBC867405D8B7F3DAADA22F",
         *           "app_hash": "1FC70854A185737C7FD720FCCE9167876EE4B9ABE23DB1EBB8C552D3E3978435",
         *           "last_results_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
         *           "evidence_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
         *           "proposer_address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA"
         *         },
         *         "commit": {
         *           "height": "67374",
         *           "round": 0,
         *           "block_id": {
         *             "hash": "A7F6B1CF33313121539206754A73FDC22ADA48C4AA8C4BB4F707ED2E089E59D3",
         *             "parts": {
         *               "total": 1,
         *               "hash": "6634FE1E1DDDCB9914ACE81F146013986F5FDA03A8F1C16DC5ECA0D9B0E08FBC"
         *             }
         *           },
         *           "signatures": [
         *             {
         *               "block_id_flag": 2,
         *               "validator_address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *               "timestamp": "2023-02-25T12:10:38.130121476Z",
         *               "signature": "HyR/uRIUNc5GNqQteZyrVjJM47SI9sRAgrLsNqJDls3AzbvHUfN4zzWyw0afyEvNm98Bm2GIoJoZC5D8oQvdBA=="
         *             }
         *           ]
         *         },
         *         "validator_set": {
         *           "validators": [
         *             {
         *               "address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *               "pub_key": {
         *                 "type": "tendermint/PubKeyEd25519",
         *                 "value": "aoB4xU9//HAqOP9ciyp0+PTdZxt/UGKgZOabU6JxW8o="
         *               },
         *               "voting_power": "5000000000",
         *               "proposer_priority": "0"
         *             }
         *           ],
         *           "proposer": {
         *             "address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *             "pub_key": {
         *               "type": "tendermint/PubKeyEd25519",
         *               "value": "aoB4xU9//HAqOP9ciyp0+PTdZxt/UGKgZOabU6JxW8o="
         *             },
         *             "voting_power": "5000000000",
         *             "proposer_priority": "0"
         *           }
         *         },
         *         "dah": {
         *           "row_roots": [
         *             "//////////7//////////ql+/VFmJ8PWE9BcjrTDLrY/hzVeGdzFCpfEhiXDXZmt",
         *             "/////////////////////zHeGnUtPJn8QyPpePSYl4qRVrcUvG2fwptyoA85Myik"
         *           ],
         *           "column_roots": [
         *             "//////////7//////////ql+/VFmJ8PWE9BcjrTDLrY/hzVeGdzFCpfEhiXDXZmt",
         *             "/////////////////////zHeGnUtPJn8QyPpePSYl4qRVrcUvG2fwptyoA85Myik"
         *           ]
         *         }
         *       }
         *     ]
         */
        header_GetRangeByHeight_Result: [
            {
                commit?: {
                    block_id?: {
                        hash?: string;
                        parts?: {
                            hash?: string;
                            total?: number;
                        };
                    };
                    height?: number;
                    round?: number;
                    signatures?: {
                        block_id_flag?: number;
                        signature?: string;
                        /** Format: date-time */
                        timestamp?: string;
                        validator_address?: string;
                    }[];
                };
                dah?: {
                    column_roots?: string[];
                    row_roots?: string[];
                };
                header?: {
                    app_hash?: string;
                    chain_id?: string;
                    consensus_hash?: string;
                    data_hash?: string;
                    evidence_hash?: string;
                    height?: number;
                    last_block_id?: {
                        hash?: string;
                        parts?: {
                            hash?: string;
                            total?: number;
                        };
                    };
                    last_commit_hash?: string;
                    last_results_hash?: string;
                    next_validators_hash?: string;
                    proposer_address?: string;
                    /** Format: date-time */
                    time?: string;
                    validators_hash?: string;
                    version?: {
                        app?: number;
                        block?: number;
                    };
                };
                validator_set?: {
                    proposer?: {
                        address?: string;
                        proposer_priority?: number;
                        pub_key?: {
                            [key: string]: unknown;
                        };
                        voting_power?: number;
                    };
                    validators?: {
                        address?: string;
                        proposer_priority?: number;
                        pub_key?: {
                            [key: string]: unknown;
                        };
                        voting_power?: number;
                    }[];
                };
            }
        ];
        /**
         * @example {
         *       "header": {
         *         "version": {
         *           "block": "11"
         *         },
         *         "chain_id": "arabica-6",
         *         "height": "67374",
         *         "time": "2023-02-25T12:10:28.067566292Z",
         *         "last_block_id": {
         *           "hash": "47A2C7758760988500B2F043D3903BBBF1C8B383CA33CF7056AA45E22055663E",
         *           "parts": {
         *             "total": 1,
         *             "hash": "33B012F244E27672169DD3D62CDBC92DA9486E410A5530F41FE6A890D8E2EE42"
         *           }
         *         },
         *         "last_commit_hash": "888D47F5E9473501C99F2B6136B6B9FFBC9D1CD2F54002BCD5DF002FFEF0A83D",
         *         "data_hash": "257760461993F8F197B421EC7435F3C36C3734923E3DA9A42DC73B05F07B3D08",
         *         "validators_hash": "883A0C92B8D976312B249C1397E73CF2981A9EB715717CBEE3800B8380C22C1D",
         *         "next_validators_hash": "883A0C92B8D976312B249C1397E73CF2981A9EB715717CBEE3800B8380C22C1D",
         *         "consensus_hash": "048091BC7DDC283F77BFBF91D73C44DA58C3DF8A9CBC867405D8B7F3DAADA22F",
         *         "app_hash": "1FC70854A185737C7FD720FCCE9167876EE4B9ABE23DB1EBB8C552D3E3978435",
         *         "last_results_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
         *         "evidence_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
         *         "proposer_address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA"
         *       },
         *       "commit": {
         *         "height": "67374",
         *         "round": 0,
         *         "block_id": {
         *           "hash": "A7F6B1CF33313121539206754A73FDC22ADA48C4AA8C4BB4F707ED2E089E59D3",
         *           "parts": {
         *             "total": 1,
         *             "hash": "6634FE1E1DDDCB9914ACE81F146013986F5FDA03A8F1C16DC5ECA0D9B0E08FBC"
         *           }
         *         },
         *         "signatures": [
         *           {
         *             "block_id_flag": 2,
         *             "validator_address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *             "timestamp": "2023-02-25T12:10:38.130121476Z",
         *             "signature": "HyR/uRIUNc5GNqQteZyrVjJM47SI9sRAgrLsNqJDls3AzbvHUfN4zzWyw0afyEvNm98Bm2GIoJoZC5D8oQvdBA=="
         *           }
         *         ]
         *       },
         *       "validator_set": {
         *         "validators": [
         *           {
         *             "address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *             "pub_key": {
         *               "type": "tendermint/PubKeyEd25519",
         *               "value": "aoB4xU9//HAqOP9ciyp0+PTdZxt/UGKgZOabU6JxW8o="
         *             },
         *             "voting_power": "5000000000",
         *             "proposer_priority": "0"
         *           }
         *         ],
         *         "proposer": {
         *           "address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *           "pub_key": {
         *             "type": "tendermint/PubKeyEd25519",
         *             "value": "aoB4xU9//HAqOP9ciyp0+PTdZxt/UGKgZOabU6JxW8o="
         *           },
         *           "voting_power": "5000000000",
         *           "proposer_priority": "0"
         *         }
         *       },
         *       "dah": {
         *         "row_roots": [
         *           "//////////7//////////ql+/VFmJ8PWE9BcjrTDLrY/hzVeGdzFCpfEhiXDXZmt",
         *           "/////////////////////zHeGnUtPJn8QyPpePSYl4qRVrcUvG2fwptyoA85Myik"
         *         ],
         *         "column_roots": [
         *           "//////////7//////////ql+/VFmJ8PWE9BcjrTDLrY/hzVeGdzFCpfEhiXDXZmt",
         *           "/////////////////////zHeGnUtPJn8QyPpePSYl4qRVrcUvG2fwptyoA85Myik"
         *         ]
         *       }
         *     }
         */
        header_LocalHead_Result: {
            commit?: {
                block_id?: {
                    hash?: string;
                    parts?: {
                        hash?: string;
                        total?: number;
                    };
                };
                height?: number;
                round?: number;
                signatures?: {
                    block_id_flag?: number;
                    signature?: string;
                    /** Format: date-time */
                    timestamp?: string;
                    validator_address?: string;
                }[];
            };
            dah?: {
                column_roots?: string[];
                row_roots?: string[];
            };
            header?: {
                app_hash?: string;
                chain_id?: string;
                consensus_hash?: string;
                data_hash?: string;
                evidence_hash?: string;
                height?: number;
                last_block_id?: {
                    hash?: string;
                    parts?: {
                        hash?: string;
                        total?: number;
                    };
                };
                last_commit_hash?: string;
                last_results_hash?: string;
                next_validators_hash?: string;
                proposer_address?: string;
                /** Format: date-time */
                time?: string;
                validators_hash?: string;
                version?: {
                    app?: number;
                    block?: number;
                };
            };
            validator_set?: {
                proposer?: {
                    address?: string;
                    proposer_priority?: number;
                    pub_key?: {
                        [key: string]: unknown;
                    };
                    voting_power?: number;
                };
                validators?: {
                    address?: string;
                    proposer_priority?: number;
                    pub_key?: {
                        [key: string]: unknown;
                    };
                    voting_power?: number;
                }[];
            };
        };
        /**
         * @example {
         *       "header": {
         *         "version": {
         *           "block": "11"
         *         },
         *         "chain_id": "arabica-6",
         *         "height": "67374",
         *         "time": "2023-02-25T12:10:28.067566292Z",
         *         "last_block_id": {
         *           "hash": "47A2C7758760988500B2F043D3903BBBF1C8B383CA33CF7056AA45E22055663E",
         *           "parts": {
         *             "total": 1,
         *             "hash": "33B012F244E27672169DD3D62CDBC92DA9486E410A5530F41FE6A890D8E2EE42"
         *           }
         *         },
         *         "last_commit_hash": "888D47F5E9473501C99F2B6136B6B9FFBC9D1CD2F54002BCD5DF002FFEF0A83D",
         *         "data_hash": "257760461993F8F197B421EC7435F3C36C3734923E3DA9A42DC73B05F07B3D08",
         *         "validators_hash": "883A0C92B8D976312B249C1397E73CF2981A9EB715717CBEE3800B8380C22C1D",
         *         "next_validators_hash": "883A0C92B8D976312B249C1397E73CF2981A9EB715717CBEE3800B8380C22C1D",
         *         "consensus_hash": "048091BC7DDC283F77BFBF91D73C44DA58C3DF8A9CBC867405D8B7F3DAADA22F",
         *         "app_hash": "1FC70854A185737C7FD720FCCE9167876EE4B9ABE23DB1EBB8C552D3E3978435",
         *         "last_results_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
         *         "evidence_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
         *         "proposer_address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA"
         *       },
         *       "commit": {
         *         "height": "67374",
         *         "round": 0,
         *         "block_id": {
         *           "hash": "A7F6B1CF33313121539206754A73FDC22ADA48C4AA8C4BB4F707ED2E089E59D3",
         *           "parts": {
         *             "total": 1,
         *             "hash": "6634FE1E1DDDCB9914ACE81F146013986F5FDA03A8F1C16DC5ECA0D9B0E08FBC"
         *           }
         *         },
         *         "signatures": [
         *           {
         *             "block_id_flag": 2,
         *             "validator_address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *             "timestamp": "2023-02-25T12:10:38.130121476Z",
         *             "signature": "HyR/uRIUNc5GNqQteZyrVjJM47SI9sRAgrLsNqJDls3AzbvHUfN4zzWyw0afyEvNm98Bm2GIoJoZC5D8oQvdBA=="
         *           }
         *         ]
         *       },
         *       "validator_set": {
         *         "validators": [
         *           {
         *             "address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *             "pub_key": {
         *               "type": "tendermint/PubKeyEd25519",
         *               "value": "aoB4xU9//HAqOP9ciyp0+PTdZxt/UGKgZOabU6JxW8o="
         *             },
         *             "voting_power": "5000000000",
         *             "proposer_priority": "0"
         *           }
         *         ],
         *         "proposer": {
         *           "address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *           "pub_key": {
         *             "type": "tendermint/PubKeyEd25519",
         *             "value": "aoB4xU9//HAqOP9ciyp0+PTdZxt/UGKgZOabU6JxW8o="
         *           },
         *           "voting_power": "5000000000",
         *           "proposer_priority": "0"
         *         }
         *       },
         *       "dah": {
         *         "row_roots": [
         *           "//////////7//////////ql+/VFmJ8PWE9BcjrTDLrY/hzVeGdzFCpfEhiXDXZmt",
         *           "/////////////////////zHeGnUtPJn8QyPpePSYl4qRVrcUvG2fwptyoA85Myik"
         *         ],
         *         "column_roots": [
         *           "//////////7//////////ql+/VFmJ8PWE9BcjrTDLrY/hzVeGdzFCpfEhiXDXZmt",
         *           "/////////////////////zHeGnUtPJn8QyPpePSYl4qRVrcUvG2fwptyoA85Myik"
         *         ]
         *       }
         *     }
         */
        header_NetworkHead_Result: {
            commit?: {
                block_id?: {
                    hash?: string;
                    parts?: {
                        hash?: string;
                        total?: number;
                    };
                };
                height?: number;
                round?: number;
                signatures?: {
                    block_id_flag?: number;
                    signature?: string;
                    /** Format: date-time */
                    timestamp?: string;
                    validator_address?: string;
                }[];
            };
            dah?: {
                column_roots?: string[];
                row_roots?: string[];
            };
            header?: {
                app_hash?: string;
                chain_id?: string;
                consensus_hash?: string;
                data_hash?: string;
                evidence_hash?: string;
                height?: number;
                last_block_id?: {
                    hash?: string;
                    parts?: {
                        hash?: string;
                        total?: number;
                    };
                };
                last_commit_hash?: string;
                last_results_hash?: string;
                next_validators_hash?: string;
                proposer_address?: string;
                /** Format: date-time */
                time?: string;
                validators_hash?: string;
                version?: {
                    app?: number;
                    block?: number;
                };
            };
            validator_set?: {
                proposer?: {
                    address?: string;
                    proposer_priority?: number;
                    pub_key?: {
                        [key: string]: unknown;
                    };
                    voting_power?: number;
                };
                validators?: {
                    address?: string;
                    proposer_priority?: number;
                    pub_key?: {
                        [key: string]: unknown;
                    };
                    voting_power?: number;
                }[];
            };
        };
        /**
         * @example {
         *       "id": 42,
         *       "height": 42,
         *       "from_height": 42,
         *       "to_height": 42,
         *       "from_hash": "453D0BC3CB88A2ED6F2E06021383B22C72D25D7741AE51B4CAE1AD34D72A3F07",
         *       "to_hash": "453D0BC3CB88A2ED6F2E06021383B22C72D25D7741AE51B4CAE1AD34D72A3F07",
         *       "start": "0001-01-01T00:00:00Z",
         *       "end": "0001-01-01T00:00:00Z",
         *       "error": "string value"
         *     }
         */
        header_SyncState_Result: {
            /** Format: date-time */
            end?: string;
            error?: string;
            from_hash?: string;
            from_height?: number;
            height?: number;
            id?: number;
            /** Format: date-time */
            start?: string;
            to_hash?: string;
            to_height?: number;
        };
        header_SyncWait_Result: null;
        /**
         * @example {
         *       "header": {
         *         "version": {
         *           "block": "11"
         *         },
         *         "chain_id": "arabica-6",
         *         "height": "67374",
         *         "time": "2023-02-25T12:10:28.067566292Z",
         *         "last_block_id": {
         *           "hash": "47A2C7758760988500B2F043D3903BBBF1C8B383CA33CF7056AA45E22055663E",
         *           "parts": {
         *             "total": 1,
         *             "hash": "33B012F244E27672169DD3D62CDBC92DA9486E410A5530F41FE6A890D8E2EE42"
         *           }
         *         },
         *         "last_commit_hash": "888D47F5E9473501C99F2B6136B6B9FFBC9D1CD2F54002BCD5DF002FFEF0A83D",
         *         "data_hash": "257760461993F8F197B421EC7435F3C36C3734923E3DA9A42DC73B05F07B3D08",
         *         "validators_hash": "883A0C92B8D976312B249C1397E73CF2981A9EB715717CBEE3800B8380C22C1D",
         *         "next_validators_hash": "883A0C92B8D976312B249C1397E73CF2981A9EB715717CBEE3800B8380C22C1D",
         *         "consensus_hash": "048091BC7DDC283F77BFBF91D73C44DA58C3DF8A9CBC867405D8B7F3DAADA22F",
         *         "app_hash": "1FC70854A185737C7FD720FCCE9167876EE4B9ABE23DB1EBB8C552D3E3978435",
         *         "last_results_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
         *         "evidence_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
         *         "proposer_address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA"
         *       },
         *       "commit": {
         *         "height": "67374",
         *         "round": 0,
         *         "block_id": {
         *           "hash": "A7F6B1CF33313121539206754A73FDC22ADA48C4AA8C4BB4F707ED2E089E59D3",
         *           "parts": {
         *             "total": 1,
         *             "hash": "6634FE1E1DDDCB9914ACE81F146013986F5FDA03A8F1C16DC5ECA0D9B0E08FBC"
         *           }
         *         },
         *         "signatures": [
         *           {
         *             "block_id_flag": 2,
         *             "validator_address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *             "timestamp": "2023-02-25T12:10:38.130121476Z",
         *             "signature": "HyR/uRIUNc5GNqQteZyrVjJM47SI9sRAgrLsNqJDls3AzbvHUfN4zzWyw0afyEvNm98Bm2GIoJoZC5D8oQvdBA=="
         *           }
         *         ]
         *       },
         *       "validator_set": {
         *         "validators": [
         *           {
         *             "address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *             "pub_key": {
         *               "type": "tendermint/PubKeyEd25519",
         *               "value": "aoB4xU9//HAqOP9ciyp0+PTdZxt/UGKgZOabU6JxW8o="
         *             },
         *             "voting_power": "5000000000",
         *             "proposer_priority": "0"
         *           }
         *         ],
         *         "proposer": {
         *           "address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *           "pub_key": {
         *             "type": "tendermint/PubKeyEd25519",
         *             "value": "aoB4xU9//HAqOP9ciyp0+PTdZxt/UGKgZOabU6JxW8o="
         *           },
         *           "voting_power": "5000000000",
         *           "proposer_priority": "0"
         *         }
         *       },
         *       "dah": {
         *         "row_roots": [
         *           "//////////7//////////ql+/VFmJ8PWE9BcjrTDLrY/hzVeGdzFCpfEhiXDXZmt",
         *           "/////////////////////zHeGnUtPJn8QyPpePSYl4qRVrcUvG2fwptyoA85Myik"
         *         ],
         *         "column_roots": [
         *           "//////////7//////////ql+/VFmJ8PWE9BcjrTDLrY/hzVeGdzFCpfEhiXDXZmt",
         *           "/////////////////////zHeGnUtPJn8QyPpePSYl4qRVrcUvG2fwptyoA85Myik"
         *         ]
         *       }
         *     }
         */
        header_Tail_Result: {
            commit?: {
                block_id?: {
                    hash?: string;
                    parts?: {
                        hash?: string;
                        total?: number;
                    };
                };
                height?: number;
                round?: number;
                signatures?: {
                    block_id_flag?: number;
                    signature?: string;
                    /** Format: date-time */
                    timestamp?: string;
                    validator_address?: string;
                }[];
            };
            dah?: {
                column_roots?: string[];
                row_roots?: string[];
            };
            header?: {
                app_hash?: string;
                chain_id?: string;
                consensus_hash?: string;
                data_hash?: string;
                evidence_hash?: string;
                height?: number;
                last_block_id?: {
                    hash?: string;
                    parts?: {
                        hash?: string;
                        total?: number;
                    };
                };
                last_commit_hash?: string;
                last_results_hash?: string;
                next_validators_hash?: string;
                proposer_address?: string;
                /** Format: date-time */
                time?: string;
                validators_hash?: string;
                version?: {
                    app?: number;
                    block?: number;
                };
            };
            validator_set?: {
                proposer?: {
                    address?: string;
                    proposer_priority?: number;
                    pub_key?: {
                        [key: string]: unknown;
                    };
                    voting_power?: number;
                };
                validators?: {
                    address?: string;
                    proposer_priority?: number;
                    pub_key?: {
                        [key: string]: unknown;
                    };
                    voting_power?: number;
                }[];
            };
        };
        /** @example 42 */
        header_WaitForHeight_Param0_u: number;
        /**
         * @example {
         *       "header": {
         *         "version": {
         *           "block": "11"
         *         },
         *         "chain_id": "arabica-6",
         *         "height": "67374",
         *         "time": "2023-02-25T12:10:28.067566292Z",
         *         "last_block_id": {
         *           "hash": "47A2C7758760988500B2F043D3903BBBF1C8B383CA33CF7056AA45E22055663E",
         *           "parts": {
         *             "total": 1,
         *             "hash": "33B012F244E27672169DD3D62CDBC92DA9486E410A5530F41FE6A890D8E2EE42"
         *           }
         *         },
         *         "last_commit_hash": "888D47F5E9473501C99F2B6136B6B9FFBC9D1CD2F54002BCD5DF002FFEF0A83D",
         *         "data_hash": "257760461993F8F197B421EC7435F3C36C3734923E3DA9A42DC73B05F07B3D08",
         *         "validators_hash": "883A0C92B8D976312B249C1397E73CF2981A9EB715717CBEE3800B8380C22C1D",
         *         "next_validators_hash": "883A0C92B8D976312B249C1397E73CF2981A9EB715717CBEE3800B8380C22C1D",
         *         "consensus_hash": "048091BC7DDC283F77BFBF91D73C44DA58C3DF8A9CBC867405D8B7F3DAADA22F",
         *         "app_hash": "1FC70854A185737C7FD720FCCE9167876EE4B9ABE23DB1EBB8C552D3E3978435",
         *         "last_results_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
         *         "evidence_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
         *         "proposer_address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA"
         *       },
         *       "commit": {
         *         "height": "67374",
         *         "round": 0,
         *         "block_id": {
         *           "hash": "A7F6B1CF33313121539206754A73FDC22ADA48C4AA8C4BB4F707ED2E089E59D3",
         *           "parts": {
         *             "total": 1,
         *             "hash": "6634FE1E1DDDCB9914ACE81F146013986F5FDA03A8F1C16DC5ECA0D9B0E08FBC"
         *           }
         *         },
         *         "signatures": [
         *           {
         *             "block_id_flag": 2,
         *             "validator_address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *             "timestamp": "2023-02-25T12:10:38.130121476Z",
         *             "signature": "HyR/uRIUNc5GNqQteZyrVjJM47SI9sRAgrLsNqJDls3AzbvHUfN4zzWyw0afyEvNm98Bm2GIoJoZC5D8oQvdBA=="
         *           }
         *         ]
         *       },
         *       "validator_set": {
         *         "validators": [
         *           {
         *             "address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *             "pub_key": {
         *               "type": "tendermint/PubKeyEd25519",
         *               "value": "aoB4xU9//HAqOP9ciyp0+PTdZxt/UGKgZOabU6JxW8o="
         *             },
         *             "voting_power": "5000000000",
         *             "proposer_priority": "0"
         *           }
         *         ],
         *         "proposer": {
         *           "address": "57DC09D28388DBF977CFC30EF50BE8B644CCC1FA",
         *           "pub_key": {
         *             "type": "tendermint/PubKeyEd25519",
         *             "value": "aoB4xU9//HAqOP9ciyp0+PTdZxt/UGKgZOabU6JxW8o="
         *           },
         *           "voting_power": "5000000000",
         *           "proposer_priority": "0"
         *         }
         *       },
         *       "dah": {
         *         "row_roots": [
         *           "//////////7//////////ql+/VFmJ8PWE9BcjrTDLrY/hzVeGdzFCpfEhiXDXZmt",
         *           "/////////////////////zHeGnUtPJn8QyPpePSYl4qRVrcUvG2fwptyoA85Myik"
         *         ],
         *         "column_roots": [
         *           "//////////7//////////ql+/VFmJ8PWE9BcjrTDLrY/hzVeGdzFCpfEhiXDXZmt",
         *           "/////////////////////zHeGnUtPJn8QyPpePSYl4qRVrcUvG2fwptyoA85Myik"
         *         ]
         *       }
         *     }
         */
        header_WaitForHeight_Result: {
            commit?: {
                block_id?: {
                    hash?: string;
                    parts?: {
                        hash?: string;
                        total?: number;
                    };
                };
                height?: number;
                round?: number;
                signatures?: {
                    block_id_flag?: number;
                    signature?: string;
                    /** Format: date-time */
                    timestamp?: string;
                    validator_address?: string;
                }[];
            };
            dah?: {
                column_roots?: string[];
                row_roots?: string[];
            };
            header?: {
                app_hash?: string;
                chain_id?: string;
                consensus_hash?: string;
                data_hash?: string;
                evidence_hash?: string;
                height?: number;
                last_block_id?: {
                    hash?: string;
                    parts?: {
                        hash?: string;
                        total?: number;
                    };
                };
                last_commit_hash?: string;
                last_results_hash?: string;
                next_validators_hash?: string;
                proposer_address?: string;
                /** Format: date-time */
                time?: string;
                validators_hash?: string;
                version?: {
                    app?: number;
                    block?: number;
                };
            };
            validator_set?: {
                proposer?: {
                    address?: string;
                    proposer_priority?: number;
                    pub_key?: {
                        [key: string]: unknown;
                    };
                    voting_power?: number;
                };
                validators?: {
                    address?: string;
                    proposer_priority?: number;
                    pub_key?: {
                        [key: string]: unknown;
                    };
                    voting_power?: number;
                }[];
            };
        };
        /**
         * @example [
         *       "admin"
         *     ]
         */
        node_AuthNew_Param0_perms: [
            string
        ];
        /** @example string value */
        node_AuthNew_Result: string;
        /**
         * @example [
         *       "admin"
         *     ]
         */
        node_AuthNewWithExpiry_Param0_perms: [
            string
        ];
        /** @example 1000000000 */
        node_AuthNewWithExpiry_Param1_ttl: number;
        /** @example string value */
        node_AuthNewWithExpiry_Result: string;
        /** @example string value */
        node_AuthVerify_Param0_token: string;
        /**
         * @example [
         *       "admin"
         *     ]
         */
        node_AuthVerify_Result: [
            string
        ];
        /**
         * @example {
         *       "type": 3,
         *       "api_version": "string value"
         *     }
         */
        node_Info_Result: {
            api_version?: string;
            type?: number;
        };
        /** @example string value */
        node_LogLevelSet_Param0_name: string;
        /** @example string value */
        node_LogLevelSet_Param1_level: string;
        node_LogLevelSet_Result: null;
        /** @example true */
        node_Ready_Result: boolean;
        /** @example CovLVG4fQcqUS6DmoMxAwVJGNW6PMzfwTG6BHW9NH9TLGHcbRfvPVc3JVhnufK3HTzStoTo */
        p2p_BandwidthForPeer_Param0_id: string;
        /**
         * @example {
         *       "TotalIn": 42,
         *       "TotalOut": 42,
         *       "RateIn": 42,
         *       "RateOut": 42
         *     }
         */
        p2p_BandwidthForPeer_Result: {
            RateIn?: number;
            RateOut?: number;
            TotalIn?: number;
            TotalOut?: number;
        };
        /** @example /celestia/mocha/ipfs/bitswap */
        p2p_BandwidthForProtocol_Param0_proto: string;
        /**
         * @example {
         *       "TotalIn": 42,
         *       "TotalOut": 42,
         *       "RateIn": 42,
         *       "RateOut": 42
         *     }
         */
        p2p_BandwidthForProtocol_Result: {
            RateIn?: number;
            RateOut?: number;
            TotalIn?: number;
            TotalOut?: number;
        };
        /**
         * @example {
         *       "TotalIn": 42,
         *       "TotalOut": 42,
         *       "RateIn": 42,
         *       "RateOut": 42
         *     }
         */
        p2p_BandwidthStats_Result: {
            RateIn?: number;
            RateOut?: number;
            TotalIn?: number;
            TotalOut?: number;
        };
        /** @example CovLVG4fQcqUS6DmoMxAwVJGNW6PMzfwTG6BHW9NH9TLGHcbRfvPVc3JVhnufK3HTzStoTo */
        p2p_BlockPeer_Param0_p: string;
        p2p_BlockPeer_Result: null;
        /** @example CovLVG4fQcqUS6DmoMxAwVJGNW6PMzfwTG6BHW9NH9TLGHcbRfvPVc3JVhnufK3HTzStoTo */
        p2p_ClosePeer_Param0_id: string;
        p2p_ClosePeer_Result: null;
        /**
         * @example {
         *       "ID": "CovLVG4fQcqUS6DmoMxAwVJGNW6PMzfwTG6BHW9NH9TLGHcbRfvPVc3JVhnufK3HTzStoTo",
         *       "Addrs": [
         *         "/ip6/::1/udp/2121/quic-v1"
         *       ]
         *     }
         */
        p2p_Connect_Param0_pi: {
            Addrs?: Record<string, never>[][];
            ID?: string;
        };
        p2p_Connect_Result: null;
        /** @example CovLVG4fQcqUS6DmoMxAwVJGNW6PMzfwTG6BHW9NH9TLGHcbRfvPVc3JVhnufK3HTzStoTo */
        p2p_Connectedness_Param0_id: string;
        /** @example 1 */
        p2p_Connectedness_Result: number;
        /** @example CovLVG4fQcqUS6DmoMxAwVJGNW6PMzfwTG6BHW9NH9TLGHcbRfvPVc3JVhnufK3HTzStoTo */
        p2p_ConnectionState_Param0_peer: string;
        /**
         * @example [
         *       {
         *         "Info": {
         *           "StreamMultiplexer": "/celestia/mocha/ipfs/bitswap",
         *           "Security": "/celestia/mocha/ipfs/bitswap",
         *           "Transport": "string value",
         *           "UsedEarlyMuxerNegotiation": true
         *         },
         *         "NumStreams": 42,
         *         "Direction": 0,
         *         "Opened": "0001-01-01T00:00:00Z",
         *         "Limited": true
         *       }
         *     ]
         */
        p2p_ConnectionState_Result: [
            {
                Direction?: number;
                Info?: {
                    Direction?: number;
                    Info?: unknown;
                    Limited?: boolean;
                    NumStreams?: number;
                    /** Format: date-time */
                    Opened?: string;
                };
                Limited?: boolean;
                NumStreams?: number;
                /** Format: date-time */
                Opened?: string;
            }
        ];
        /**
         * @example {
         *       "ID": "CovLVG4fQcqUS6DmoMxAwVJGNW6PMzfwTG6BHW9NH9TLGHcbRfvPVc3JVhnufK3HTzStoTo",
         *       "Addrs": [
         *         "/ip6/::1/udp/2121/quic-v1"
         *       ]
         *     }
         */
        p2p_Info_Result: {
            Addrs?: Record<string, never>[][];
            ID?: string;
        };
        /** @example CovLVG4fQcqUS6DmoMxAwVJGNW6PMzfwTG6BHW9NH9TLGHcbRfvPVc3JVhnufK3HTzStoTo */
        p2p_IsProtected_Param0_id: string;
        /** @example string value */
        p2p_IsProtected_Param1_tag: string;
        /** @example true */
        p2p_IsProtected_Result: boolean;
        /**
         * @example [
         *       "CovLVG4fQcqUS6DmoMxAwVJGNW6PMzfwTG6BHW9NH9TLGHcbRfvPVc3JVhnufK3HTzStoTo"
         *     ]
         */
        p2p_ListBlockedPeers_Result: [
            string
        ];
        /** @example 2 */
        p2p_NATStatus_Result: number;
        /** @example CovLVG4fQcqUS6DmoMxAwVJGNW6PMzfwTG6BHW9NH9TLGHcbRfvPVc3JVhnufK3HTzStoTo */
        p2p_PeerInfo_Param0_id: string;
        /**
         * @example {
         *       "ID": "CovLVG4fQcqUS6DmoMxAwVJGNW6PMzfwTG6BHW9NH9TLGHcbRfvPVc3JVhnufK3HTzStoTo",
         *       "Addrs": [
         *         "/ip6/::1/udp/2121/quic-v1"
         *       ]
         *     }
         */
        p2p_PeerInfo_Result: {
            Addrs?: Record<string, never>[][];
            ID?: string;
        };
        /**
         * @example [
         *       "CovLVG4fQcqUS6DmoMxAwVJGNW6PMzfwTG6BHW9NH9TLGHcbRfvPVc3JVhnufK3HTzStoTo"
         *     ]
         */
        p2p_Peers_Result: [
            string
        ];
        /** @example CovLVG4fQcqUS6DmoMxAwVJGNW6PMzfwTG6BHW9NH9TLGHcbRfvPVc3JVhnufK3HTzStoTo */
        p2p_Ping_Param0_peer: string;
        /** @example 1000000000 */
        p2p_Ping_Result: number;
        /** @example CovLVG4fQcqUS6DmoMxAwVJGNW6PMzfwTG6BHW9NH9TLGHcbRfvPVc3JVhnufK3HTzStoTo */
        p2p_Protect_Param0_id: string;
        /** @example string value */
        p2p_Protect_Param1_tag: string;
        p2p_Protect_Result: null;
        /** @example string value */
        p2p_PubSubPeers_Param0_topic: string;
        /**
         * @example [
         *       "CovLVG4fQcqUS6DmoMxAwVJGNW6PMzfwTG6BHW9NH9TLGHcbRfvPVc3JVhnufK3HTzStoTo"
         *     ]
         */
        p2p_PubSubPeers_Result: [
            string
        ];
        /**
         * @example [
         *       "string value"
         *     ]
         */
        p2p_PubSubTopics_Result: [
            string
        ];
        /**
         * @example {
         *       "System": {
         *         "NumStreamsInbound": 4,
         *         "NumStreamsOutbound": 13,
         *         "NumConnsInbound": 0,
         *         "NumConnsOutbound": 13,
         *         "NumFD": 7,
         *         "Memory": 4456448
         *       },
         *       "Transient": {
         *         "NumStreamsInbound": 0,
         *         "NumStreamsOutbound": 0,
         *         "NumConnsInbound": 0,
         *         "NumConnsOutbound": 0,
         *         "NumFD": 0,
         *         "Memory": 0
         *       },
         *       "Services": {
         *         "libp2p.autonat": {
         *           "NumStreamsInbound": 0,
         *           "NumStreamsOutbound": 0,
         *           "NumConnsInbound": 0,
         *           "NumConnsOutbound": 0,
         *           "NumFD": 0,
         *           "Memory": 0
         *         },
         *         "libp2p.identify": {
         *           "NumStreamsInbound": 0,
         *           "NumStreamsOutbound": 0,
         *           "NumConnsInbound": 0,
         *           "NumConnsOutbound": 0,
         *           "NumFD": 0,
         *           "Memory": 0
         *         }
         *       },
         *       "Protocols": {
         *         "/celestia/arabica-3/ipfs/bitswap/1.2.0": {
         *           "NumStreamsInbound": 0,
         *           "NumStreamsOutbound": 4,
         *           "NumConnsInbound": 0,
         *           "NumConnsOutbound": 0,
         *           "NumFD": 0,
         *           "Memory": 0
         *         },
         *         "/celestia/arabica-3/kad/1.0.0": {
         *           "NumStreamsInbound": 0,
         *           "NumStreamsOutbound": 4,
         *           "NumConnsInbound": 0,
         *           "NumConnsOutbound": 0,
         *           "NumFD": 0,
         *           "Memory": 0
         *         },
         *         "/floodsub/1.0.0": {
         *           "NumStreamsInbound": 2,
         *           "NumStreamsOutbound": 0,
         *           "NumConnsInbound": 0,
         *           "NumConnsOutbound": 0,
         *           "NumFD": 0,
         *           "Memory": 0
         *         },
         *         "/ipfs/id/1.0.0": {
         *           "NumStreamsInbound": 0,
         *           "NumStreamsOutbound": 1,
         *           "NumConnsInbound": 0,
         *           "NumConnsOutbound": 0,
         *           "NumFD": 0,
         *           "Memory": 0
         *         },
         *         "/meshsub/1.1.0": {
         *           "NumStreamsInbound": 2,
         *           "NumStreamsOutbound": 4,
         *           "NumConnsInbound": 0,
         *           "NumConnsOutbound": 0,
         *           "NumFD": 0,
         *           "Memory": 0
         *         }
         *       },
         *       "Peers": {
         *         "\u0000$\b\u0001\u0012 �-��&��Y�k�\u000e\u0011�S�RM\u0013�\u0015��$����*�\u0002W": {
         *           "NumStreamsInbound": 1,
         *           "NumStreamsOutbound": 3,
         *           "NumConnsInbound": 0,
         *           "NumConnsOutbound": 3,
         *           "NumFD": 3,
         *           "Memory": 1048576
         *         }
         *       }
         *     }
         */
        p2p_ResourceState_Result: {
            Peers?: {
                [key: string]: {
                    Memory?: number;
                    NumConnsInbound?: number;
                    NumConnsOutbound?: number;
                    NumFD?: number;
                    NumStreamsInbound?: number;
                    NumStreamsOutbound?: number;
                };
            };
            Protocols?: {
                [key: string]: {
                    Memory?: number;
                    NumConnsInbound?: number;
                    NumConnsOutbound?: number;
                    NumFD?: number;
                    NumStreamsInbound?: number;
                    NumStreamsOutbound?: number;
                };
            };
            Services?: {
                [key: string]: {
                    Memory?: number;
                    NumConnsInbound?: number;
                    NumConnsOutbound?: number;
                    NumFD?: number;
                    NumStreamsInbound?: number;
                    NumStreamsOutbound?: number;
                };
            };
            System?: {
                Memory?: number;
                NumConnsInbound?: number;
                NumConnsOutbound?: number;
                NumFD?: number;
                NumStreamsInbound?: number;
                NumStreamsOutbound?: number;
            };
            Transient?: {
                Memory?: number;
                NumConnsInbound?: number;
                NumConnsOutbound?: number;
                NumFD?: number;
                NumStreamsInbound?: number;
                NumStreamsOutbound?: number;
            };
        };
        /** @example CovLVG4fQcqUS6DmoMxAwVJGNW6PMzfwTG6BHW9NH9TLGHcbRfvPVc3JVhnufK3HTzStoTo */
        p2p_UnblockPeer_Param0_p: string;
        p2p_UnblockPeer_Result: null;
        /** @example CovLVG4fQcqUS6DmoMxAwVJGNW6PMzfwTG6BHW9NH9TLGHcbRfvPVc3JVhnufK3HTzStoTo */
        p2p_Unprotect_Param0_id: string;
        /** @example string value */
        p2p_Unprotect_Param1_tag: string;
        /** @example true */
        p2p_Unprotect_Result: boolean;
        /** @example 42 */
        share_GetEDS_Param0_height: number;
        /**
         * @example {
         *       "data_square": [
         *         "//////////////////////////////////////4BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
         *         "//////////////////////////////////////4BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
         *         "//////////////////////////////////////4BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
         *         "//////////////////////////////////////4BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
         *       ],
         *       "codec": "Leopard"
         *     }
         */
        share_GetEDS_Result: Record<string, never>;
        /** @example 42 */
        share_GetNamespaceData_Param0_height: number;
        /** @example AAAAAAAAAAAAAAAAAAAAAAAAAAAAAMJ/xGlNMdE= */
        share_GetNamespaceData_Param1_namespace: Record<string, never>;
        /**
         * @example [
         *       {
         *         "shares": [
         *           null
         *         ],
         *         "proof": {}
         *       }
         *     ]
         */
        share_GetNamespaceData_Result: [
            {
                proof?: Record<string, never>;
                shares?: Record<string, never>[];
            }
        ];
        /** @example 42 */
        share_GetRange_Param0_height: number;
        /** @example 42 */
        share_GetRange_Param1_from: number;
        /** @example 42 */
        share_GetRange_Param2_to: number;
        /**
         * @example {
         *       "Shares": [
         *         null
         *       ],
         *       "Proof": {
         *         "data": [
         *           "Ynl0ZSBhcnJheQ=="
         *         ],
         *         "share_proofs": [
         *           {
         *             "start": 42,
         *             "end": 42,
         *             "nodes": [
         *               "Ynl0ZSBhcnJheQ=="
         *             ],
         *             "leaf_hash": "Ynl0ZSBhcnJheQ=="
         *           }
         *         ],
         *         "namespace_id": "Ynl0ZSBhcnJheQ==",
         *         "row_proof": {
         *           "row_roots": [
         *             "453D0BC3CB88A2ED6F2E06021383B22C72D25D7741AE51B4CAE1AD34D72A3F07"
         *           ],
         *           "proofs": [
         *             {
         *               "total": "42",
         *               "index": "42",
         *               "leaf_hash": "Ynl0ZSBhcnJheQ==",
         *               "aunts": [
         *                 "Ynl0ZSBhcnJheQ=="
         *               ]
         *             }
         *           ],
         *           "start_row": 42,
         *           "end_row": 42
         *         },
         *         "namespace_version": 42
         *       }
         *     }
         */
        share_GetRange_Result: {
            Proof?: {
                data?: string[];
                namespace_id?: string;
                namespace_version?: number;
                row_proof?: {
                    end_row?: number;
                    proofs?: {
                        aunts?: string[];
                        index?: number;
                        leaf_hash?: string;
                        total?: number;
                    }[];
                    row_roots?: string[];
                    start_row?: number;
                };
                share_proofs?: {
                    end?: number;
                    leaf_hash?: string;
                    nodes?: string[];
                    start?: number;
                }[];
            };
            Shares?: Record<string, never>[];
        };
        /** @example 42 */
        share_GetRow_Param0_height: number;
        /** @example 42 */
        share_GetRow_Param1_rowIdx: number;
        /**
         * @example {
         *       "shares": null,
         *       "side": "LEFT"
         *     }
         */
        share_GetRow_Result: Record<string, never>;
        /** @example 42 */
        share_GetSamples_Param0_height: number;
        /**
         * @example [
         *       {
         *         "row": 42,
         *         "col": 42
         *       }
         *     ]
         */
        share_GetSamples_Param1_indices: [
            {
                col?: number;
                row?: number;
            }
        ];
        /**
         * @example [
         *       {
         *         "share": null,
         *         "proof": {},
         *         "proof_type": 0
         *       }
         *     ]
         */
        share_GetSamples_Result: [
            {
                Proof?: Record<string, never>;
                ProofType?: number;
            }
        ];
        /** @example 42 */
        share_GetShare_Param0_height: number;
        /** @example 42 */
        share_GetShare_Param1_row: number;
        /** @example 42 */
        share_GetShare_Param2_col: number;
        /** @example null */
        share_GetShare_Result: Record<string, never>;
        /** @example 42 */
        share_SharesAvailable_Param0_height: number;
        share_SharesAvailable_Result: null;
        /** @example celestia1377k5an3f94v6wyaceu0cf4nq6gk2jtpc46g7h */
        state_AccountAddress_Result: Record<string, never>;
        /**
         * @example {
         *       "denom": "string value",
         *       "amount": "42"
         *     }
         */
        state_Balance_Result: {
            amount?: Record<string, never>;
            denom?: string;
        };
        /** @example celestia1377k5an3f94v6wyaceu0cf4nq6gk2jtpc46g7h */
        state_BalanceForAddress_Param0_addr: Record<string, never>;
        /**
         * @example {
         *       "denom": "string value",
         *       "amount": "42"
         *     }
         */
        state_BalanceForAddress_Result: {
            amount?: Record<string, never>;
            denom?: string;
        };
        /** @example celestiavaloper1q3v5cugc8cdpud87u4zwy0a74uxkk6u4q4gx4p */
        state_BeginRedelegate_Param0_srcValAddr: string;
        /** @example celestiavaloper1q3v5cugc8cdpud87u4zwy0a74uxkk6u4q4gx4p */
        state_BeginRedelegate_Param1_dstValAddr: string;
        /** @example 42 */
        state_BeginRedelegate_Param2_amount: Record<string, never>;
        /**
         * @example {
         *       "gas_price": 0.002,
         *       "is_gas_price_set": true,
         *       "max_gas_price": 0.4,
         *       "gas": 142225,
         *       "tx_priority": 1,
         *       "key_name": "my_celes_key",
         *       "signer_address": "celestia1pjcmwj8w6hyr2c4wehakc5g8cfs36aysgucx66",
         *       "fee_granter_address": "celestia1hakc56ax66ypjcmwj8w6hyr2c4g8cfs3wesguc"
         *     }
         */
        state_BeginRedelegate_Param3_config: Record<string, never>;
        /**
         * @example {
         *       "height": 30497,
         *       "txhash": "05D9016060072AA71B007A6CFB1B895623192D6616D513017964C3BFCD047282",
         *       "logs": null,
         *       "events": null
         *     }
         */
        state_BeginRedelegate_Result: {
            code?: number;
            codespace?: string;
            data?: string;
            events?: {
                attributes?: {
                    index?: boolean;
                    key?: string;
                    value?: string;
                }[];
                type?: string;
            }[];
            gas_used?: number;
            gas_wanted?: number;
            height?: number;
            info?: string;
            logs?: {
                events?: {
                    attributes?: {
                        key?: string;
                        value?: string;
                    }[];
                    type?: string;
                }[];
                log?: string;
                msg_index?: number;
            }[];
            raw_log?: string;
            signers?: string[];
            timestamp?: string;
            tx?: {
                type_url?: string;
                value?: string;
            };
            txhash?: string;
        };
        /** @example celestiavaloper1q3v5cugc8cdpud87u4zwy0a74uxkk6u4q4gx4p */
        state_CancelUnbondingDelegation_Param0_valAddr: string;
        /** @example 42 */
        state_CancelUnbondingDelegation_Param1_amount: Record<string, never>;
        /** @example 42 */
        state_CancelUnbondingDelegation_Param2_height: Record<string, never>;
        /**
         * @example {
         *       "gas_price": 0.002,
         *       "is_gas_price_set": true,
         *       "max_gas_price": 0.4,
         *       "gas": 142225,
         *       "tx_priority": 1,
         *       "key_name": "my_celes_key",
         *       "signer_address": "celestia1pjcmwj8w6hyr2c4wehakc5g8cfs36aysgucx66",
         *       "fee_granter_address": "celestia1hakc56ax66ypjcmwj8w6hyr2c4g8cfs3wesguc"
         *     }
         */
        state_CancelUnbondingDelegation_Param3_config: Record<string, never>;
        /**
         * @example {
         *       "height": 30497,
         *       "txhash": "05D9016060072AA71B007A6CFB1B895623192D6616D513017964C3BFCD047282",
         *       "logs": null,
         *       "events": null
         *     }
         */
        state_CancelUnbondingDelegation_Result: {
            code?: number;
            codespace?: string;
            data?: string;
            events?: {
                attributes?: {
                    index?: boolean;
                    key?: string;
                    value?: string;
                }[];
                type?: string;
            }[];
            gas_used?: number;
            gas_wanted?: number;
            height?: number;
            info?: string;
            logs?: {
                events?: {
                    attributes?: {
                        key?: string;
                        value?: string;
                    }[];
                    type?: string;
                }[];
                log?: string;
                msg_index?: number;
            }[];
            raw_log?: string;
            signers?: string[];
            timestamp?: string;
            tx?: {
                type_url?: string;
                value?: string;
            };
            txhash?: string;
        };
        /** @example celestiavaloper1q3v5cugc8cdpud87u4zwy0a74uxkk6u4q4gx4p */
        state_Delegate_Param0_delAddr: string;
        /** @example 42 */
        state_Delegate_Param1_amount: Record<string, never>;
        /**
         * @example {
         *       "gas_price": 0.002,
         *       "is_gas_price_set": true,
         *       "max_gas_price": 0.4,
         *       "gas": 142225,
         *       "tx_priority": 1,
         *       "key_name": "my_celes_key",
         *       "signer_address": "celestia1pjcmwj8w6hyr2c4wehakc5g8cfs36aysgucx66",
         *       "fee_granter_address": "celestia1hakc56ax66ypjcmwj8w6hyr2c4g8cfs3wesguc"
         *     }
         */
        state_Delegate_Param2_config: Record<string, never>;
        /**
         * @example {
         *       "height": 30497,
         *       "txhash": "05D9016060072AA71B007A6CFB1B895623192D6616D513017964C3BFCD047282",
         *       "logs": null,
         *       "events": null
         *     }
         */
        state_Delegate_Result: {
            code?: number;
            codespace?: string;
            data?: string;
            events?: {
                attributes?: {
                    index?: boolean;
                    key?: string;
                    value?: string;
                }[];
                type?: string;
            }[];
            gas_used?: number;
            gas_wanted?: number;
            height?: number;
            info?: string;
            logs?: {
                events?: {
                    attributes?: {
                        key?: string;
                        value?: string;
                    }[];
                    type?: string;
                }[];
                log?: string;
                msg_index?: number;
            }[];
            raw_log?: string;
            signers?: string[];
            timestamp?: string;
            tx?: {
                type_url?: string;
                value?: string;
            };
            txhash?: string;
        };
        /** @example celestia1377k5an3f94v6wyaceu0cf4nq6gk2jtpc46g7h */
        state_GrantFee_Param0_grantee: string;
        /** @example 42 */
        state_GrantFee_Param1_amount: Record<string, never>;
        /**
         * @example {
         *       "gas_price": 0.002,
         *       "is_gas_price_set": true,
         *       "max_gas_price": 0.4,
         *       "gas": 142225,
         *       "tx_priority": 1,
         *       "key_name": "my_celes_key",
         *       "signer_address": "celestia1pjcmwj8w6hyr2c4wehakc5g8cfs36aysgucx66",
         *       "fee_granter_address": "celestia1hakc56ax66ypjcmwj8w6hyr2c4g8cfs3wesguc"
         *     }
         */
        state_GrantFee_Param2_config: Record<string, never>;
        /**
         * @example {
         *       "height": 30497,
         *       "txhash": "05D9016060072AA71B007A6CFB1B895623192D6616D513017964C3BFCD047282",
         *       "logs": null,
         *       "events": null
         *     }
         */
        state_GrantFee_Result: {
            code?: number;
            codespace?: string;
            data?: string;
            events?: {
                attributes?: {
                    index?: boolean;
                    key?: string;
                    value?: string;
                }[];
                type?: string;
            }[];
            gas_used?: number;
            gas_wanted?: number;
            height?: number;
            info?: string;
            logs?: {
                events?: {
                    attributes?: {
                        key?: string;
                        value?: string;
                    }[];
                    type?: string;
                }[];
                log?: string;
                msg_index?: number;
            }[];
            raw_log?: string;
            signers?: string[];
            timestamp?: string;
            tx?: {
                type_url?: string;
                value?: string;
            };
            txhash?: string;
        };
        /** @example celestiavaloper1q3v5cugc8cdpud87u4zwy0a74uxkk6u4q4gx4p */
        state_QueryDelegation_Param0_valAddr: string;
        /**
         * @example {
         *       "delegation_response": {
         *         "delegation": {
         *           "delegator_address": "string value",
         *           "validator_address": "string value",
         *           "shares": "0"
         *         },
         *         "balance": {
         *           "denom": "utia",
         *           "amount": "42"
         *         }
         *       }
         *     }
         */
        state_QueryDelegation_Result: {
            delegation_response?: {
                balance?: {
                    amount?: Record<string, never>;
                    denom?: string;
                };
                delegation?: {
                    delegator_address?: string;
                    shares?: Record<string, never>;
                    validator_address?: string;
                };
            };
        };
        /** @example celestiavaloper1q3v5cugc8cdpud87u4zwy0a74uxkk6u4q4gx4p */
        state_QueryRedelegations_Param0_srcValAddr: string;
        /** @example celestiavaloper1q3v5cugc8cdpud87u4zwy0a74uxkk6u4q4gx4p */
        state_QueryRedelegations_Param1_dstValAddr: string;
        /**
         * @example {
         *       "redelegation_responses": [
         *         {
         *           "redelegation": {
         *             "delegator_address": "string value",
         *             "validator_src_address": "string value",
         *             "validator_dst_address": "string value",
         *             "entries": [
         *               {
         *                 "creation_height": 42,
         *                 "completion_time": "0001-01-01T00:00:00Z",
         *                 "initial_balance": "42",
         *                 "shares_dst": "0",
         *                 "unbonding_id": 42,
         *                 "unbonding_on_hold_ref_count": 42
         *               }
         *             ]
         *           },
         *           "entries": [
         *             {
         *               "redelegation_entry": {
         *                 "creation_height": 42,
         *                 "completion_time": "0001-01-01T00:00:00Z",
         *                 "initial_balance": "42",
         *                 "shares_dst": "0",
         *                 "unbonding_id": 42,
         *                 "unbonding_on_hold_ref_count": 42
         *               },
         *               "balance": "42"
         *             }
         *           ]
         *         }
         *       ],
         *       "pagination": {
         *         "next_key": "Ynl0ZSBhcnJheQ==",
         *         "total": 42
         *       }
         *     }
         */
        state_QueryRedelegations_Result: {
            pagination?: {
                next_key?: string;
                total?: number;
            };
            redelegation_responses?: {
                entries?: {
                    balance?: Record<string, never>;
                    redelegation_entry?: {
                        /** Format: date-time */
                        completion_time?: string;
                        creation_height?: number;
                        initial_balance?: Record<string, never>;
                        shares_dst?: Record<string, never>;
                        unbonding_id?: number;
                        unbonding_on_hold_ref_count?: number;
                    };
                }[];
                redelegation?: {
                    delegator_address?: string;
                    entries?: {
                        /** Format: date-time */
                        completion_time?: string;
                        creation_height?: number;
                        initial_balance?: Record<string, never>;
                        shares_dst?: Record<string, never>;
                        unbonding_id?: number;
                        unbonding_on_hold_ref_count?: number;
                    }[];
                    validator_dst_address?: string;
                    validator_src_address?: string;
                };
            }[];
        };
        /** @example celestiavaloper1q3v5cugc8cdpud87u4zwy0a74uxkk6u4q4gx4p */
        state_QueryUnbonding_Param0_valAddr: string;
        /**
         * @example {
         *       "unbond": {
         *         "delegator_address": "string value",
         *         "validator_address": "string value",
         *         "entries": [
         *           {
         *             "creation_height": 42,
         *             "completion_time": "0001-01-01T00:00:00Z",
         *             "initial_balance": "42",
         *             "balance": "42",
         *             "unbonding_id": 42,
         *             "unbonding_on_hold_ref_count": 42
         *           }
         *         ]
         *       }
         *     }
         */
        state_QueryUnbonding_Result: {
            unbond?: {
                delegator_address?: string;
                entries?: {
                    balance?: Record<string, never>;
                    /** Format: date-time */
                    completion_time?: string;
                    creation_height?: number;
                    initial_balance?: Record<string, never>;
                    unbonding_id?: number;
                    unbonding_on_hold_ref_count?: number;
                }[];
                validator_address?: string;
            };
        };
        /** @example celestia1377k5an3f94v6wyaceu0cf4nq6gk2jtpc46g7h */
        state_RevokeGrantFee_Param0_grantee: string;
        /**
         * @example {
         *       "gas_price": 0.002,
         *       "is_gas_price_set": true,
         *       "max_gas_price": 0.4,
         *       "gas": 142225,
         *       "tx_priority": 1,
         *       "key_name": "my_celes_key",
         *       "signer_address": "celestia1pjcmwj8w6hyr2c4wehakc5g8cfs36aysgucx66",
         *       "fee_granter_address": "celestia1hakc56ax66ypjcmwj8w6hyr2c4g8cfs3wesguc"
         *     }
         */
        state_RevokeGrantFee_Param1_config: Record<string, never>;
        /**
         * @example {
         *       "height": 30497,
         *       "txhash": "05D9016060072AA71B007A6CFB1B895623192D6616D513017964C3BFCD047282",
         *       "logs": null,
         *       "events": null
         *     }
         */
        state_RevokeGrantFee_Result: {
            code?: number;
            codespace?: string;
            data?: string;
            events?: {
                attributes?: {
                    index?: boolean;
                    key?: string;
                    value?: string;
                }[];
                type?: string;
            }[];
            gas_used?: number;
            gas_wanted?: number;
            height?: number;
            info?: string;
            logs?: {
                events?: {
                    attributes?: {
                        key?: string;
                        value?: string;
                    }[];
                    type?: string;
                }[];
                log?: string;
                msg_index?: number;
            }[];
            raw_log?: string;
            signers?: string[];
            timestamp?: string;
            tx?: {
                type_url?: string;
                value?: string;
            };
            txhash?: string;
        };
        /**
         * @example [
         *       {
         *         "namespace_id": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAwn/EaU0x0Q==",
         *         "data": "z8QyNztvogN7NYU27gI+nJgg1vMJtkK3vbduSDz7/8mhmos37I7duH51kkgouxrsdhdOBJ1431OmipNfVedbtwe6zQ06EbJBl/jk4QwwU3S29YBTUZcUfTzXpEJIuMrYzU6YPxN8Zce/KNdsEIy4zxdfxekXpvsgZMBhf83iYgfHvsFAoJmmCp/ORAUoAFf7tJ7cF8RZyA20ftqRa1uhAmktxIb58abpGTG+TNgq3mjyvswECVykJYqGjqNtInyIx2EQOnVp2q69YHkegdoBvoOKzEFigQTdrL2TZBex4MhkrYt7Zf0DQyNMRkCPL/zKYE3bhvXNWMThWCmhD5TOApzirORXKOTB0nxhjDF/aFYkrS+IKBw1KfJ5isldWvmasJBWwRgDuli6Cty67vMMk7fUUTUf0St6rvQeftSoEVlC1xEw46+h5kIXaWiM0g/EzGIAdZHycUFWCSdnt3p7BS5ttEpSf1d6ZbVYYL2y0XguH41k54JqufEMAw9ukmaF0IbN9Jk6fNefV1dsWTdCP6Mz6e+RTCd9DQGqb2VrsvMzx5uVidLD8ND79pvXgL1VzyhJaMTcjSfZK15jOxLwGh1arZc2gyTNiq2pu6wNz0tdJp+fFU+peG8rHN8="
         *       }
         *     ]
         */
        state_SubmitPayForBlob_Param0_blobs: [
            Record<string, never>
        ];
        /**
         * @example {
         *       "gas_price": 0.002,
         *       "is_gas_price_set": true,
         *       "max_gas_price": 0.4,
         *       "gas": 142225,
         *       "tx_priority": 1,
         *       "key_name": "my_celes_key",
         *       "signer_address": "celestia1pjcmwj8w6hyr2c4wehakc5g8cfs36aysgucx66",
         *       "fee_granter_address": "celestia1hakc56ax66ypjcmwj8w6hyr2c4g8cfs3wesguc"
         *     }
         */
        state_SubmitPayForBlob_Param1_config: Record<string, never>;
        /**
         * @example {
         *       "height": 30497,
         *       "txhash": "05D9016060072AA71B007A6CFB1B895623192D6616D513017964C3BFCD047282",
         *       "logs": null,
         *       "events": null
         *     }
         */
        state_SubmitPayForBlob_Result: {
            code?: number;
            codespace?: string;
            data?: string;
            events?: {
                attributes?: {
                    index?: boolean;
                    key?: string;
                    value?: string;
                }[];
                type?: string;
            }[];
            gas_used?: number;
            gas_wanted?: number;
            height?: number;
            info?: string;
            logs?: {
                events?: {
                    attributes?: {
                        key?: string;
                        value?: string;
                    }[];
                    type?: string;
                }[];
                log?: string;
                msg_index?: number;
            }[];
            raw_log?: string;
            signers?: string[];
            timestamp?: string;
            tx?: {
                type_url?: string;
                value?: string;
            };
            txhash?: string;
        };
        /** @example celestia1377k5an3f94v6wyaceu0cf4nq6gk2jtpc46g7h */
        state_Transfer_Param0_to: string;
        /** @example 42 */
        state_Transfer_Param1_amount: Record<string, never>;
        /**
         * @example {
         *       "gas_price": 0.002,
         *       "is_gas_price_set": true,
         *       "max_gas_price": 0.4,
         *       "gas": 142225,
         *       "tx_priority": 1,
         *       "key_name": "my_celes_key",
         *       "signer_address": "celestia1pjcmwj8w6hyr2c4wehakc5g8cfs36aysgucx66",
         *       "fee_granter_address": "celestia1hakc56ax66ypjcmwj8w6hyr2c4g8cfs3wesguc"
         *     }
         */
        state_Transfer_Param2_config: Record<string, never>;
        /**
         * @example {
         *       "height": 30497,
         *       "txhash": "05D9016060072AA71B007A6CFB1B895623192D6616D513017964C3BFCD047282",
         *       "logs": null,
         *       "events": null
         *     }
         */
        state_Transfer_Result: {
            code?: number;
            codespace?: string;
            data?: string;
            events?: {
                attributes?: {
                    index?: boolean;
                    key?: string;
                    value?: string;
                }[];
                type?: string;
            }[];
            gas_used?: number;
            gas_wanted?: number;
            height?: number;
            info?: string;
            logs?: {
                events?: {
                    attributes?: {
                        key?: string;
                        value?: string;
                    }[];
                    type?: string;
                }[];
                log?: string;
                msg_index?: number;
            }[];
            raw_log?: string;
            signers?: string[];
            timestamp?: string;
            tx?: {
                type_url?: string;
                value?: string;
            };
            txhash?: string;
        };
        /** @example celestiavaloper1q3v5cugc8cdpud87u4zwy0a74uxkk6u4q4gx4p */
        state_Undelegate_Param0_delAddr: string;
        /** @example 42 */
        state_Undelegate_Param1_amount: Record<string, never>;
        /**
         * @example {
         *       "gas_price": 0.002,
         *       "is_gas_price_set": true,
         *       "max_gas_price": 0.4,
         *       "gas": 142225,
         *       "tx_priority": 1,
         *       "key_name": "my_celes_key",
         *       "signer_address": "celestia1pjcmwj8w6hyr2c4wehakc5g8cfs36aysgucx66",
         *       "fee_granter_address": "celestia1hakc56ax66ypjcmwj8w6hyr2c4g8cfs3wesguc"
         *     }
         */
        state_Undelegate_Param2_config: Record<string, never>;
        /**
         * @example {
         *       "height": 30497,
         *       "txhash": "05D9016060072AA71B007A6CFB1B895623192D6616D513017964C3BFCD047282",
         *       "logs": null,
         *       "events": null
         *     }
         */
        state_Undelegate_Result: {
            code?: number;
            codespace?: string;
            data?: string;
            events?: {
                attributes?: {
                    index?: boolean;
                    key?: string;
                    value?: string;
                }[];
                type?: string;
            }[];
            gas_used?: number;
            gas_wanted?: number;
            height?: number;
            info?: string;
            logs?: {
                events?: {
                    attributes?: {
                        key?: string;
                        value?: string;
                    }[];
                    type?: string;
                }[];
                log?: string;
                msg_index?: number;
            }[];
            raw_log?: string;
            signers?: string[];
            timestamp?: string;
            tx?: {
                type_url?: string;
                value?: string;
            };
            txhash?: string;
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
