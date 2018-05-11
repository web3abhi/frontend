import { get as ENV } from 'react-global-configuration'
import { observable, action } from 'mobx'
import { get, post, put, patch } from 'axios'
const API = ENV('apiDomain')

class SingleJobStore {
  @observable remote
  @observable paidRelocation
  @observable visaSponsor
  @observable jobTitle
  @observable jobDesctiption
  @observable jobLocation
  @observable companyName
  @observable companyLogo
  @observable bossName
  @observable bossPicture
  @observable filled

}

class JobStore {
  @observable loading = false
  @observable _changes = []
  @observable job = {
    remote: false,
    paidRelocation: false,
    visaSponsor: false,
  }
  unmodifiedJob = {}

  @action fetchForEditing = ({slug: seoSlug, securitySuffix}) => {
    this.loading = true
    get(`${API}/job/findOne`, {
      withCredentials: true,
      params: {securitySuffix, seoSlug}
    })
    .then(res => {
      this.job = res.data
      this.unmodifiedJob = res.data
      this._changes = []
      this.loading = false
      this.error = false
    })
    .catch(_handleError)
  }

  @action handleChange = (e, { name, value, checked }) => {
    if (typeof value !== 'undefined') {
      this.job[name] = value
    } else {
      this.job[name] = checked || null
    }

    let _changes = this._changes || []
    _changes.push(name)
    this._changes = [...new Set(_changes)]
  }

  @action save = () => {
    this.loading = true
    put(`${API}/job/update`, this.job, { withCredentials: true })
    .then(res => {
      this.job = res.data
      this._changes = []
      this.loading = false
      this.error = false
    })
    .catch(_handleError)
  }

  @action newJob = () => {
    this.job = { supportMethodId: 2 }
    this._changes = []
    this.loading = false
    this.error = false
  }

  @action create = () => {
    this.loading = true
    put(`${API}/job`, this.job, { withCredentials: true })
    .then(res => {
      this.job = res.data
      this._changes = []
      this.loading = false
      this.error = false
    })
    .catch(_handleError)
  }

  @action imageUpload = (e) => {
    this.loading = true
    const file = e.target.files[0]
    const name = e.target.name
    const formData = new FormData()
    formData.append('file', file)
    const config = { headers: { 'content-type': 'multipart/form-data' }};

    post(`${API}/job/imgUpload`, formData, config)
    .then(res => {
      this.job[name] = res.data.secure_url;
      this.loading = false
      this.error = false
    })
    .catch(_handleError)
  }

  @action reset = () => {
    this.job = this.unmodifiedJob
    this._changes = []
  }

  employmentTypeOptions = [
    {key: 'FULL_TIME', value: 'FULL_TIME', text: 'Full-time'},
    {key: 'CONTRACTOR', value: 'CONTRACTOR', text: 'Contractor'},
    {key: 'INTERN', value: 'INTERN', text: 'Intern'},
    {key: 'OTHER', value: 'OTHER', text: 'Other'},
  ]
  jobCategories = [
    {key: 'Engineering', value: 'Engineering', text: '🛠 Engineering'},
    {key: 'Design', value: 'Design', text: '🎨 Design / Product'},
    {key: 'Trading', value: 'Trading', text: '🤑 Trading / Crypto Research'},
    {key: 'Community', value: 'Community', text: '💬 Community'},
    {key: 'Content', value: 'Content', text: '✍️ Content'},
    {key: 'Marketing', value: 'Marketing', text: '📈 Marketing'},
    {key: 'Memes', value: 'Memes', text: '🐸 Memes, gifs, glitter'},
    {key: 'Executive', value: 'Executive', text: '💼 Executive'},
    {key: 'Legal', value: 'Legal', text: '⚖️ Legal'},
    {key: 'Other', value: 'Other', text: 'Other…'},
  ]
}

const _handleError = (error) => {
  jobStore.loading = false
  this.error = error
}

const jobStore = new JobStore()
export default jobStore
