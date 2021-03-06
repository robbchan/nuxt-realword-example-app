<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>

        <article-meta :article="article" />
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12">
          <p>
            {{ article.description }}
          </p>
        </div>
      </div>

      <hr />

      <div class="article-actions">
        <div class="article-meta">
          <article-meta :article="article" />
        </div>
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <form @submit.prevent="onComment" class="card comment-form">
            <div class="card-block">
              <textarea
                v-model="comment.body"
                class="form-control"
                placeholder="Write a comment..."
                rows="3"
              ></textarea>
            </div>
            <div class="card-footer">
              <img :src="user.image" class="comment-author-img" />
              <button type="submit" class="btn btn-sm btn-primary">
                Post Comment
              </button>
            </div>
          </form>

          <div class="card" :key="comment.id" v-for="comment in comments">
            <div class="card-block">
              <p class="card-text">
                {{ comment.body }}
              </p>
            </div>
            <div class="card-footer">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username
                  }
                }"
              >
                <img :src="article.author.image" class="comment-author-img" />
              </nuxt-link>
              &nbsp;
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
              <span class="date-posted">{{
                comment.updatedAt | date("YYYY-MM-DD")
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticle } from "@/api/article";
import { addComment, getComments } from "@/api/comment";
import { mapState } from "vuex";
import ArticleMeta from "./components/article-meta";
export default {
  name: "articleIndex",
  async asyncData({ params }) {
    const slug = params.slug;
    const [articleRes, commentsRes] = await Promise.all([
      getArticle(slug),
      getComments(slug)
    ]);
    const { article } = articleRes.data;
    const { comments } = commentsRes.data;
    return {
      slug,
      article,
      comments
    };
  },
  data() {
    return {
      comment: {
        body: ""
      }
    };
  },
  components: {
    ArticleMeta
  },
  computed: {
    ...mapState(["user"])
  },
  created() {},
  mounted() {},
  methods: {
    async onComment() {
      await addComment(this.slug, {
        comment: this.comment
      });
      this.comment.body = "";
      const { data } = await getComments(this.slug);
      this.comments = data.comments;
    }
  }
};
</script>

<style scoped lang="less"></style>
