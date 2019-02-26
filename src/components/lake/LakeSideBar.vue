<template>
  <div class='lake-sidebar' v-if="lake">
    <div class='close' @click="close">x</div>
    <lake-card :lake='lake' :to_detail="true"></lake-card>
    <div class='lake-content'>
      <div>
        <label>Area </label>
        <div>{{ lake.area_sq_km }}sq. km.</div>
      </div>
      <div class='atlas-text'>
        <p>
          {{ lake.body }}...
          <router-link
            :to="{ name: 'lake', params: {slug: lake.slug } }">
            <span class='read-more'>READ MORE</span>
          </router-link>
        </p>
      </div>
      <div class='metadata section'>
        <h3>Plants data</h3>
        <div>
          <table class="table table-condensed table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Species</th>
                <th>Status</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="nowrap">Aug. 17, 2009</td>
                <td>Elodea canadensis (common elodea, Canadian waterweed)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
              <tr>
                <td class="nowrap">Aug. 17, 2009</td>
                <td>Ceratophyllum demersum (Coontail; hornwort)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
              <tr>
                <td class="nowrap">Aug. 17, 2009</td>
                <td>Potamogeton pusillus (slender pondweed)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
              <tr>
                <td class="nowrap">Aug. 17, 2009</td>
                <td>Nitella sp. (stonewort)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
              <tr>
                <td class="nowrap">Aug. 17, 2009</td>
                <td>Potamogeton praelongus (whitestem pondweed)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
              <tr>
                <td class="nowrap">Aug. 17, 2009</td>
                <td>Myriophyllum verticillatum (whorled watermilfoil)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
              <tr>
                <td class="nowrap">Sept. 10, 2007</td>
                <td>Elodea canadensis (common elodea, Canadian waterweed)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
              <tr>
                <td class="nowrap">Sept. 10, 2007</td>
                <td>Ceratophyllum demersum (Coontail; hornwort)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
              <tr>
                <td class="nowrap">Sept. 10, 2007</td>
                <td>Chara sp. (muskwort)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
              <tr>
                <td class="nowrap">Sept. 10, 2007</td>
                <td>Isoetes sp. (quillwort)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
              <tr>
                <td class="nowrap">Sept. 10, 2007</td>
                <td>Potamogeton pusillus (slender pondweed)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
              <tr>
                <td class="nowrap">Sept. 10, 2007</td>
                <td>Nitella sp. (stonewort)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
              <tr>
                <td class="nowrap">Sept. 10, 2007</td>
                <td>Persicaria amphibia (water smartweed)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
              <tr>
                <td class="nowrap">Sept. 10, 2007</td>
                <td>Potamogeton praelongus (whitestem pondweed)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>

              <tr>
                <td class="nowrap">Sept. 10, 2007</td>
                <td>Myriophyllum verticillatum (whorled watermilfoil)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
              <tr>
                <td class="nowrap">Aug. 26, 2005</td>
                <td>Elodea canadensis (common elodea, Canadian waterweed)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
              <tr>
                <td class="nowrap">Aug. 26, 2005</td>
                <td>Ceratophyllum demersum (Coontail; hornwort)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
              <tr>
                <td class="nowrap">Aug. 26, 2005</td>
                <td>Potamogeton richardsonii (Richardson's pondweed)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
              <tr>
                <td class="nowrap">Aug. 26, 2005</td>
                <td>Potamogeton pusillus (slender pondweed)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
              <tr>
                <td class="nowrap">Aug. 26, 2005</td>
                <td>Nitella sp. (stonewort)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
              <tr>
                <td class="nowrap">Aug. 26, 2005</td>
                <td>Potamogeton praelongus (whitestem pondweed)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
              <tr>
                <td class="nowrap">Aug. 26, 2005</td>
                <td>Myriophyllum verticillatum (whorled watermilfoil)</td>
                <td>Native </td>
                <td><a href="http://www.clr.pdx.edu/" class="has-tooltip" title="" data-original-title="Center for Lakes and Reservoir">CLR</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class='metadata section'>
        <h3>Mussels data</h3>
        <div>
          <table class="table table-condensed table-striped">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status/Species</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Aug. 17, 2010</td>
                <td>non detect</td>
                <td>Oregon Dept of Fish and Wildlife</td>
              </tr>
              <tr>
                <td>Aug. 10, 2012</td>
                <td>non detect</td>
                <td>Oregon Dept of Fish and Wildlife</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import LakeCard from '@/components/lake/LakeCard';

export default {
  name: 'lake-sidebar',
  props: ['lake'],
  methods: {
    ...mapActions(['setCurrentLake', 'fitBounds']),
    close () {
      this.setCurrentLake();
      this.fitBounds(this.lake.geom);
    }
  },
  components: {
    LakeCard
  }
}
</script>

<style scoped lang='scss'>

  .lake-sidebar {
    background: white;
    z-index: 1001;
    position: relative;
    padding-left: 42px;
    padding-right: 15px;
    padding-top: 45px;
  }

  .lake-content {
    padding: 15px;
  }

  .atlas-text {
    font-size: 0.75em;
  }

  .section {
    margin-top: 25px;
  }

  .close {
    position: absolute;
    right: 25px;
    padding: 10px;
    cursor: pointer;
    font-size: 1.33em;
  }

  table {
    width: 100%;
  }

</style>
