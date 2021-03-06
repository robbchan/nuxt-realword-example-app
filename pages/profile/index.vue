<template>
  <div>
    <div class="profile-page">
      <div class="user-info">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-md-10 offset-md-1">
              <img :src="profile.image" class="user-img" />
              <h4>{{ profile.username }}</h4>
              <p>
                Cofounder @GoThinkster, lived in Aol's HQ for a few months,
                kinda looks like Peeta from the Hunger Games
              </p>
              <button
                @click="onFollowUser()"
                class="btn btn-sm btn-outline-secondary action-btn"
              >
                <i class="ion-plus-round"></i>
                &nbsp; {{ profile.following ? "unfollow" : "Follow" }}
                {{ profile.username }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <div class="articles-toggle">
              <ul class="nav nav-pills outline-active">
                <li class="nav-item">
                  <nuxt-link
                    class="nav-link"
                    :class="{
                      active: tab === 'MyArticles'
                    }"
                    exact
                    :to="{
                      name: 'profile',
                      query: {
                        tab: 'MyArticles'
                      }
                    }"
                    >My Articles</nuxt-link
                  >
                </li>
                <li class="nav-item">
                  <nuxt-link
                    class="nav-link"
                    :class="{
                      active: tab === 'MyFavoritedArticles'
                    }"
                    exact
                    :to="{
                      name: 'profile',
                      query: {
                        favorited: username,
                        tab: 'MyFavoritedArticles'
                      }
                    }"
                    >Favorited Articles</nuxt-link
                  >
                </li>
              </ul>
            </div>

            <div
              class="article-preview"
              v-for="article in articles"
              :key="article.slug"
            >
              <div class="article-meta">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username
                    }
                  }"
                ></nuxt-link>
                <div class="info">
                  <nuxt-link
                    class="author"
                    :to="{
                      name: 'profile',
                      params: {
                        username: article.author.username
                      }
                    }"
                  >
                    {{ article.author.username }}
                  </nuxt-link>
                  <span class="date">{{
                    article.createdAt | date("YYYY-MM-DD")
                  }}</span>
                </div>
                <button
                  class="btn btn-outline-primary btn-sm pull-xs-right"
                  :class="{
                    active: article.favorited
                  }"
                  @click="onFavorite(article)"
                  :disabled="article.favoriteDisabled"
                >
                  <i class="ion-heart"></i> {{ article.favoritesCount }}
                </button>
              </div>
              <nuxt-link
                :to="{
                  name: 'article',
                  params: {
                    slug: article.slug
                  }
                }"
                class="preview-link"
              >
                <h1>{{ article.title }}</h1>
                <p>{{ article.description }}</p>
                <span>Read more...</span>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getProfile, followUser, unfollowUser } from "@/api/profile";
import { getArticles, addFavorite, deleteFavorite } from "@/api/article";
export default {
  name: "profileIndex",
  async asyncData({ query, params }) {
    const username = params.username;
    const favorited = query.favorited;
    const tab = query.tab || "MyArticles";
    const [profileRes, articleRes] = await Promise.all([
      getProfile(username),
      getArticles({
        author: username,
        favorited: favorited
      })
    ]);
    const { profile } = profileRes.data;
    const { articles } = articleRes.data;
    return {
      tab,
      username,
      profile,
      articles
    };
  },
  watchQuery: ["favorited", "tab"],
  computed: {
    ...mapState(["user"])
  },
  created() {},
  mounted() {},
  methods: {
    async onFavorite(article) {
      article.favoriteDisabled = true;
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug);
        article.favorited = false;
        article.favoritesCount += -1;
      } else {
        // 添加点赞
        await addFavorite(article.slug);
        article.favorited = true;
        article.favoritesCount += 1;
      }
      article.favoriteDisabled = false;
    },
    async onFollowUser() {
      if (this.profile.following) {
        await unfollowUser();
        this.profile.following = false;
      } else {
        await followUser();
        this.profile.following = true;
      }
    }
  }
};
</script>

<style scoped lang="less"></style>
