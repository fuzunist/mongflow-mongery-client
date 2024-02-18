import { SearchIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useSearch } from '@/store/hooks/apps'
import { setSearch } from '@/store/actions/apps'
import { Input } from 'antd';


const Search = () => {
    const { t } = useTranslation()
    const searchValue = useSearch()
    return (
        <div className='relative'>
            <Input
                placeholder={t('search')}
                className='rounded-2xl py-1.5 w-64'
                value={searchValue}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
                size='middle'
            />
            <SearchIcon
                size={14.4}
                strokeWidth={2}
                className='absolute top-1/2 -translate-y-1/2 right-6 cursor-pointer pointer-events-none'
            />
        </div>
    )
}

export default Search
