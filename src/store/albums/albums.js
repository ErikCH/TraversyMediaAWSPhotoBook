import { API, graphqlOperation, Storage } from "aws-amplify";
import { createAlbum as createAlbumMutation } from "@/graphql/mutations";
import { getAlbum as getAlbumQuery } from "@/graphql/queries";
import { listAlbums as listAlbumsQuery } from '@/graphql/queries';
import { createPhoto as createPhotoMutation } from "@/graphql/mutations";
import { uuid } from "uuidv4";
import awsconfig from "@/aws-exports";



export const albumInfo = {
    namespaced: true,
    state: { albums: null },
    mutations: {
        setAlbums(state, payload) {
            state.albums = payload;
        }
    },
    actions: {
        async createAlbum({ dispatch }, newAlbum) {
            try {
                await API.graphql(graphqlOperation(createAlbumMutation, { input: newAlbum }))

                dispatch("getAlbumsData");

            } catch (error) {
                console.error("createalbum", error)


            }
        },
        async getAlbum(_, albumId) {
            return await API.graphql(
                graphqlOperation(getAlbumQuery, { id: albumId })
            )
        },
        async getAlbumsData({ commit }) {
            const albumsData = await API.graphql(graphqlOperation(listAlbumsQuery));
            commit("setAlbums", albumsData.data.listAlbums.items);
        },
        async createPhoto(_, data) {
            const {
                aws_user_files_s3_bucket_region: region,
                aws_user_files_s3_bucket: bucket
            } = awsconfig;
            const { file, type: mimeType, id } = data;
            const extension = file.name.substr(file.name.lastIndexOf(".") + 1);
            const photoId = uuid();
            const key = `images/${photoId}.${extension}`;
            const inputData = {
                id: photoId,
                photoAlbumId: id,
                contentType: mimeType,
                fullsize: {
                    key,
                    region,
                    bucket
                }
            }

            //s3 bucket storage add file to it
            try {
                await Storage.put(key, file, {
                    level: "protected",
                    contentType: mimeType,
                    metadata: { albumId: id, photoId }
                })
                await API.graphql(
                    graphqlOperation(createPhotoMutation, { input: inputData })
                )
                return Promise.resolve("success");


            } catch (error) {
                console.log("createPhoto error", error)
                return Promise.reject(error);

            }
        }

    },
    getters: {
        albums: (state) => state.albums
    }
}