import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = [
  {
    author: { handle: "spurdoman" },
    time: new Date().toISOString(),
    text: "benis :D:D:D",
    id: nanoid()
  },
  {
    author: { handle: "spurdoman" },
    time: new Date().toISOString(),
    text: `Jugemu Jugemu (寿限無、寿限無)
  Gokō-no surikire (五劫の擦り切れ)
  Kaijarisuigyo-no (海砂利水魚の)
  Suigyōmatsu Unraimatsu Fūraimatsu (水行末 雲来末 風来末)
  Kuunerutokoro-ni Sumutokoro (食う寝る処に住む処)
  Yaburakōji-no burakōji (やぶら小路の藪柑子)
  Paipopaipo Paipo-no-shūringan (パイポパイポ パイポのシューリンガン)
  Shūringan-no Gūrindai (シューリンガンのグーリンダイ)
  Gūrindai-no Ponpokopī-no Ponpokonā-no (グーリンダイのポンポコピーのポンポコナーの)
  Chōkyūmei-no Chōsuke (長久命の長助)`,
    id: nanoid()
  }
];

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    createSpam(state, action) {
      state.push({
        author: { handle: "spurdoman" },
        time: new Date().toISOString(),
        text: "benis :D:D:D 2",
        id: nanoid()
      });
    },
    createPost(state, action) {
      state.push({ ...action.payload, id: nanoid() });
    }
  }
});

export const { createSpam, createPost } = postsSlice.actions;
export default postsSlice.reducer;
